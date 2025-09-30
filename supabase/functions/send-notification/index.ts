import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationData {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
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

    const notificationData: NotificationData = await req.json();
    console.log('Sending notification:', notificationData);

    // Store notification in database
    const { data: notification, error: insertError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: notificationData.user_id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing notification:', insertError);
      throw new Error('Failed to store notification');
    }

    // Send real-time notification via Supabase channel
    const channel = supabaseClient.channel('notifications');
    
    try {
      await channel.send({
        type: 'broadcast',
        event: 'notification',
        payload: {
          user_id: notificationData.user_id,
          notification: notification
        }
      });
      console.log('Real-time notification sent successfully');
    } catch (broadcastError) {
      console.error('Failed to send real-time notification:', broadcastError);
      // Don't fail the function for broadcast issues
    }

    // Handle different notification types
    switch (notificationData.type) {
      case 'order_created':
        console.log(`Order notification sent to user ${notificationData.user_id}`);
        break;
      case 'order_status_updated':
        console.log(`Order status update sent to user ${notificationData.user_id}`);
        break;
      case 'stock_alert':
        console.log(`Stock alert sent to user ${notificationData.user_id}`);
        break;
      case 'new_order_admin':
      case 'order_status_admin':
      case 'low_stock_admin':
        // Send to all admin users
        const { data: adminUsers } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('role', 'admin');
        
        if (adminUsers) {
          console.log(`Sending notification to ${adminUsers.length} admin users`);
          for (const admin of adminUsers) {
            await supabaseClient
              .from('notifications')
              .insert({
                user_id: admin.id,
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
                data: notificationData.data,
                is_read: false
              });
          }
        }
        break;
    }

    return new Response(JSON.stringify({
      success: true,
      notification
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error in send-notification function:', error);
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