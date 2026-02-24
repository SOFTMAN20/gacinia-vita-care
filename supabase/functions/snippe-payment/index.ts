import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SNIPPE_API_URL = 'https://api.snippe.sh';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SNIPPE_API_KEY = Deno.env.get('SNIPPE_API_KEY');
    if (!SNIPPE_API_KEY) {
      throw new Error('SNIPPE_API_KEY is not configured');
    }

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { order_id, redirect_url } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: 'order_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch order details with items
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      throw new Error('Order not found');
    }

    // Verify the order belongs to the authenticated user
    if (order.user_id !== claimsData.claims.sub) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user profile for customer info
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('full_name, phone')
      .eq('id', order.user_id)
      .single();

    // Build Snippe session line items
    const lineItems = order.order_items.map((item: any) => ({
      name: item.products?.name || 'Product',
      quantity: item.quantity,
      unit_price: Math.round(item.unit_price),
      total: Math.round(item.total_price),
    }));

    // Add delivery fee as line item if applicable
    if (order.delivery_fee > 0) {
      lineItems.push({
        name: 'Delivery Fee',
        quantity: 1,
        unit_price: Math.round(order.delivery_fee),
        total: Math.round(order.delivery_fee),
      });
    }

    // Build webhook URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const webhookUrl = `${supabaseUrl}/functions/v1/snippe-webhook`;

    // Determine customer info from delivery address or profile
    const deliveryAddress = order.delivery_address as any;
    const customerName = deliveryAddress?.fullName || profile?.full_name || '';
    const customerPhone = deliveryAddress?.phone || profile?.phone || '';
    const customerEmail = deliveryAddress?.email || '';

    // Create Snippe payment session
    const sessionPayload: any = {
      amount: Math.round(order.total_amount),
      currency: 'TZS',
      allowed_methods: ['mobile_money', 'qr', 'card'],
      description: `Gacinia Order #${order.order_number}`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      webhook_url: webhookUrl,
      expires_in: 3600,
      line_items: lineItems,
      display: {
        show_line_items: true,
      },
    };

    if (redirect_url) {
      sessionPayload.redirect_url = redirect_url;
    }

    if (customerName || customerPhone || customerEmail) {
      sessionPayload.customer = {};
      if (customerName) sessionPayload.customer.name = customerName;
      if (customerPhone) sessionPayload.customer.phone = customerPhone;
      if (customerEmail) sessionPayload.customer.email = customerEmail;
    }

    console.log('Creating Snippe session:', JSON.stringify(sessionPayload));

    const snippeResponse = await fetch(`${SNIPPE_API_URL}/v1/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SNIPPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionPayload),
    });

    const snippeData = await snippeResponse.json();

    if (!snippeResponse.ok) {
      console.error('Snippe API error:', JSON.stringify(snippeData));
      throw new Error(`Snippe API error [${snippeResponse.status}]: ${JSON.stringify(snippeData)}`);
    }

    console.log('Snippe session created:', JSON.stringify(snippeData));

    // Store the Snippe reference on the order for later verification
    await serviceClient
      .from('orders')
      .update({
        notes: `${order.notes || ''}\n[snippe_ref:${snippeData.data?.reference}]`.trim(),
      })
      .eq('id', order_id);

    return new Response(JSON.stringify({
      success: true,
      checkout_url: snippeData.data?.checkout_url,
      reference: snippeData.data?.reference,
      payment_link_url: snippeData.data?.payment_link_url,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in snippe-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
