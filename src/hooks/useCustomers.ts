import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    region: string;
  } | null;
  joinDate: string;
  lastOrder: string | null;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'retail' | 'wholesale';
}

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      // Get all profiles with their auth user data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, phone, role, created_at')
        .eq('role', 'customer');

      if (profilesError) throw profilesError;

      // Get all users to get email addresses
      let emailMap = new Map<string, string>();
      try {
        const response = await supabase.auth.admin.listUsers();
        const users = response?.data?.users;
        if (users && Array.isArray(users)) {
          users.forEach((u: any) => {
            if (u?.email && u?.id) {
              emailMap.set(u.id, u.email);
            }
          });
        }
      } catch (error) {
        console.log('Could not fetch user emails from admin API');
      }

      // Get orders data for each customer
      const customerIds = profiles?.map(p => p.id) || [];
      
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, created_at, status')
        .in('user_id', customerIds);

      if (ordersError) throw ordersError;

      // Get addresses for each customer
      const { data: addresses, error: addressesError } = await supabase
        .from('addresses')
        .select('user_id, street, city, region, is_default')
        .in('user_id', customerIds);

      if (addressesError) throw addressesError;

      // Process data to create customer objects
      const customers: CustomerData[] = await Promise.all(
        (profiles || []).map(async (profile) => {
          const userOrders = orders?.filter(o => o.user_id === profile.id) || [];
          const completedOrders = userOrders.filter(o => o.status === 'delivered');
          const userAddress = addresses?.find(a => a.user_id === profile.id && a.is_default) || 
                             addresses?.find(a => a.user_id === profile.id);
          
          // Get email - try from admin API first, then fallback to default
          let email: string = emailMap.get(profile.id) || '';
          if (!email) {
            try {
              const { data: { user } } = await supabase.auth.admin.getUserById(profile.id);
              email = user?.email || `${profile.username}@customer.gacinia.com`;
            } catch (e) {
              email = `${profile.username}@customer.gacinia.com`;
            }
          }

          const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
          const lastOrderDate = userOrders.length > 0 
            ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
            : null;

          // Determine customer type based on order volume/value
          const customerType: 'retail' | 'wholesale' = totalSpent > 1000000 || completedOrders.length > 20 
            ? 'wholesale' 
            : 'retail';

          // Determine status based on last order date
          const daysSinceLastOrder = lastOrderDate 
            ? Math.floor((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
            : 999;
          
          const status: 'active' | 'inactive' | 'blocked' = 
            daysSinceLastOrder < 30 ? 'active' : 
            daysSinceLastOrder < 90 ? 'inactive' : 
            'inactive';

          return {
            id: profile.id,
            name: profile.full_name || profile.username,
            email: email || `${profile.username}@customer.gacinia.com`,
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
        })
      );

      return customers.sort((a, b) => b.totalSpent - a.totalSpent);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
