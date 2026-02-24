import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface OrderData {
  delivery_address: any;
  payment_method: string;
  notes?: string;
}

export const useProcessOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { state, clearCart } = useCart();
  const { toast } = useToast();

  const processOrder = async (orderData: OrderData) => {
    if (!user) {
      throw new Error('User must be authenticated to place an order');
    }

    if (state.items.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order items
      const items = state.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price
      }));

      // Call our edge function to process the order
      const { data, error: functionError } = await supabase.functions.invoke('process-order', {
        body: {
          orderData: {
            user_id: user.id,
            items,
            delivery_address: orderData.delivery_address,
            payment_method: orderData.payment_method,
            notes: orderData.notes
          }
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || 'Failed to process order');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to process order');
      }

      const order = data.order;

      // For non-COD payments, create a Snippe payment session
      if (orderData.payment_method !== 'cod') {
        try {
          const redirectUrl = `${window.location.origin}/payment/return?order_number=${order.order_number}&status=completed`;

          const { data: snippeData, error: snippeError } = await supabase.functions.invoke('snippe-payment', {
            body: {
              order_id: order.id,
              redirect_url: redirectUrl,
            }
          });

          if (snippeError) {
            console.error('Snippe payment error:', snippeError);
            // Order was created but payment session failed - still return the order
            toast({
              title: 'Order Created',
              description: `Order #${order.order_number} created. Payment link could not be generated - please contact support.`,
              variant: 'destructive',
            });
            clearCart();
            return { ...order, payment_redirect: null };
          }

          if (snippeData?.checkout_url) {
            clearCart();
            return { ...order, payment_redirect: snippeData.checkout_url };
          }
        } catch (snippeErr) {
          console.error('Snippe integration error:', snippeErr);
        }
      }

      // For COD or if Snippe redirect not available
      clearCart();

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${order.order_number} has been placed and is being processed.`,
      });

      return { ...order, payment_redirect: null };

    } catch (err: any) {
      console.error('Error processing order:', err);
      const errorMessage = err.message || 'Failed to process order';
      setError(errorMessage);
      
      toast({
        title: 'Order Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    processOrder,
    loading,
    error
  };
};