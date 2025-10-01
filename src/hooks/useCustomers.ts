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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call the edge function to get customers with real emails
      const { data, error } = await supabase.functions.invoke('get-customers', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      return (data.customers || []).sort((a: CustomerData, b: CustomerData) => b.totalSpent - a.totalSpent);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
