import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the user is an admin
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all customer profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, username, full_name, phone, role, created_at')
      .eq('role', 'customer');

    if (profilesError) throw profilesError;

    // Get all users with service role to access emails
    const { data: { users }, error: usersError } = await supabaseClient.auth.admin.listUsers();
    if (usersError) throw usersError;

    // Create email mapping
    const emailMap = new Map(users.map(u => [u.id, u.email || '']));

    // Get orders for each customer
    const customerIds = profiles?.map(p => p.id) || [];
    
    const { data: orders } = await supabaseClient
      .from('orders')
      .select('user_id, total_amount, created_at, status')
      .in('user_id', customerIds);

    // Get addresses for each customer
    const { data: addresses } = await supabaseClient
      .from('addresses')
      .select('user_id, street, city, region, is_default')
      .in('user_id', customerIds);

    // Build customer data
    const customers = profiles?.map(profile => {
      const userOrders = orders?.filter(o => o.user_id === profile.id) || [];
      const completedOrders = userOrders.filter(o => o.status === 'delivered');
      const userAddress = addresses?.find(a => a.user_id === profile.id && a.is_default) || 
                         addresses?.find(a => a.user_id === profile.id);
      
      const email = emailMap.get(profile.id) || '';
      const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const lastOrderDate = userOrders.length > 0 
        ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
        : null;

      const customerType = totalSpent > 1000000 || completedOrders.length > 20 ? 'wholesale' : 'retail';

      const daysSinceLastOrder = lastOrderDate 
        ? Math.floor((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      const status = daysSinceLastOrder < 30 ? 'active' : 'inactive';

      return {
        id: profile.id,
        name: profile.full_name || profile.username,
        email: email,
        phone: profile.phone || 'N/A',
        address: userAddress ? {
          street: userAddress.street,
          city: userAddress.city,
          region: userAddress.region
        } : null,
        joinDate: profile.created_at,
        lastOrder: lastOrderDate,
        totalOrders: completedOrders.length,
        totalSpent,
        status,
        customerType
      };
    }) || [];

    return new Response(JSON.stringify({ customers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
