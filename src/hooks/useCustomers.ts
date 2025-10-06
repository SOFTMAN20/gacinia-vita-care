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
      try {
        // Get current session for authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }

        // Call the edge function to get customers with real emails from auth.users
        const { data, error } = await supabase.functions.invoke('get-customers', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        if (!data || !data.customers) {
          throw new Error('No customer data returned');
        }

        // The edge function already returns properly formatted customer data
        return data.customers as CustomerData[];
      } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
