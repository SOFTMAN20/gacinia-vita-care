import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

interface OrderData {
  user_id: string;
  items: OrderItem[];
  delivery_address: any;
  payment_method: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { orderData }: { orderData: OrderData } = await req.json();
    console.log('Processing order:', orderData);

    // Start transaction-like operation
    // 1. Check stock availability
    const productIds = orderData.items.map(item => item.product_id);
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, name, stock_count, price')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error('Failed to fetch products');
    }

    // Validate stock availability
    const stockIssues = [];
    for (const item of orderData.items) {
      const product = products?.find(p => p.id === item.product_id);
      if (!product) {
        stockIssues.push(`Product ${item.product_id} not found`);
      } else if (product.stock_count < item.quantity) {
        stockIssues.push(`Insufficient stock for ${product.name}. Available: ${product.stock_count}, Requested: ${item.quantity}`);
      }
    }

    if (stockIssues.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Stock validation failed',
        details: stockIssues
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 2. Calculate totals
    let subtotal = 0;
    const enrichedItems = orderData.items.map(item => {
      const product = products?.find(p => p.id === item.product_id);
      const totalPrice = item.quantity * item.unit_price;
      subtotal += totalPrice;
      return {
        ...item,
        total_price: totalPrice
      };
    });

    const deliveryFee = subtotal > 50000 ? 0 : 5000; // Free delivery over 50,000 TZS
    const taxAmount = 0; // No tax as requested
    const totalAmount = subtotal + deliveryFee;

    // 3. Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        status: 'pending',
        payment_status: 'pending',
        payment_method: orderData.payment_method,
        subtotal,
        tax_amount: taxAmount,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        delivery_address: orderData.delivery_address,
        notes: orderData.notes
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created:', order);

    // 4. Create order items
    const orderItemsData = enrichedItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }));

    const { error: orderItemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsData);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      // Rollback order
      await supabaseClient.from('orders').delete().eq('id', order.id);
      throw new Error('Failed to create order items');
    }

    // 5. Update product stock (this will trigger real-time updates)
    for (const item of orderData.items) {
      const product = products?.find(p => p.id === item.product_id);
      if (product) {
        const newStockCount = product.stock_count - item.quantity;
        const { error: stockError } = await supabaseClient
          .from('products')
          .update({
            stock_count: newStockCount,
            in_stock: newStockCount > 0
          })
          .eq('id', item.product_id);

        if (stockError) {
          console.error('Error updating stock:', stockError);
          // Continue with other items even if one fails
        } else {
          console.log(`Updated stock for product ${item.product_id}: ${product.stock_count} -> ${newStockCount}`);
        }
      }
    }

    // 6. Clear user's cart
    const { error: cartError } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', orderData.user_id);

    if (cartError) {
      console.error('Error clearing cart:', cartError);
      // Don't fail the order for this
    }

    // 7. Send notification to customer
    try {
      await supabaseClient.functions.invoke('send-notification', {
        body: {
          user_id: orderData.user_id,
          type: 'order_created',
          title: 'Order Placed Successfully',
          message: `Your order #${order.order_number} has been placed and is being processed.`,
          data: {
            order_id: order.id,
            order_number: order.order_number,
            total_amount: totalAmount
          }
        }
      });
    } catch (notificationError) {
      console.error('Failed to send customer notification:', notificationError);
      // Don't fail the order for notification issues
    }

    // 8. Send notification to admins about new order
    try {
      await supabaseClient.functions.invoke('send-notification', {
        body: {
          user_id: 'admin', // This will be handled by the admin notification logic
          type: 'new_order_admin',
          title: 'New Order Received',
          message: `Order #${order.order_number} placed for TZS ${totalAmount.toLocaleString()}`,
          data: {
            order_id: order.id,
            order_number: order.order_number,
            total_amount: totalAmount,
            user_id: orderData.user_id
          }
        }
      });
      console.log('Admin notification sent for new order');
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail the order for notification issues
    }

    return new Response(JSON.stringify({
      success: true,
      order: {
        ...order,
        order_items: orderItemsData
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error in process-order function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);