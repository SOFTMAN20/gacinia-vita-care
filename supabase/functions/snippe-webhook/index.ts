import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-event, x-webhook-timestamp, x-webhook-signature',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookEvent = req.headers.get('X-Webhook-Event');
    const body = await req.text();
    const payload = JSON.parse(body);

    console.log(`Snippe webhook received: ${webhookEvent}`, body);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const eventType = payload.type || webhookEvent;
    const data = payload.data;

    if (!data?.metadata?.order_id) {
      console.log('No order_id in metadata, skipping');
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderId = data.metadata.order_id;

    if (eventType === 'payment.completed') {
      console.log(`Payment completed for order ${orderId}`);

      // Update order payment status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        throw new Error(`Failed to update order: ${updateError.message}`);
      }

      // Send notification to the customer
      const { data: order } = await supabase
        .from('orders')
        .select('user_id, order_number, total_amount')
        .eq('id', orderId)
        .single();

      if (order) {
        try {
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'payment_confirmed',
            title: 'Payment Confirmed',
            message: `Payment for order #${order.order_number} has been confirmed. TZS ${order.total_amount.toLocaleString()}`,
            data: {
              order_id: orderId,
              order_number: order.order_number,
              amount: data.amount?.value,
              channel: data.channel?.type,
              provider: data.channel?.provider,
            },
          });
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }

      console.log(`Order ${orderId} marked as paid and confirmed`);

    } else if (eventType === 'payment.failed') {
      console.log(`Payment failed for order ${orderId}:`, data.failure_reason);

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
      }

      // Notify customer of failure
      const { data: order } = await supabase
        .from('orders')
        .select('user_id, order_number')
        .eq('id', orderId)
        .single();

      if (order) {
        try {
          await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'payment_failed',
            title: 'Payment Failed',
            message: `Payment for order #${order.order_number} failed. Please try again or choose a different payment method.`,
            data: {
              order_id: orderId,
              order_number: order.order_number,
              failure_reason: data.failure_reason,
            },
          });
        } catch (notifError) {
          console.error('Failed to send notification:', notifError);
        }
      }

      console.log(`Order ${orderId} payment marked as failed`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in snippe-webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
