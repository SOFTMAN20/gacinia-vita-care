import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Address {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  region: string;
  postal_code?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  upload_date: string;
  expiry_date?: string;
  doctor_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    original_price?: number;
    image_url?: string;
    in_stock: boolean;
  };
}

export interface OrderWithItems {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cash_on_delivery';
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  order_number?: string;
  created_at: string;
  updated_at: string;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      id: string;
      name: string;
      image_url?: string;
    };
  }>;
}

// Hook to fetch user addresses
export const useAddresses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Address[];
    },
    enabled: !!user,
  });
};

// Hook to fetch user orders
export const useUserOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product:products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as OrderWithItems[];
    },
    enabled: !!user,
  });
};

// Hook to fetch user prescriptions
export const usePrescriptions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['prescriptions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Prescription[];
    },
    enabled: !!user,
  });
};

// Hook to fetch user wishlist
export const useWishlist = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            original_price,
            image_url,
            in_stock
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });
};

// Mutation hooks for addresses
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('addresses')
        .insert([{ ...address, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast({
        title: "Success",
        description: "Address added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Address> & { id: string }) => {
      const { data, error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    },
  });
};

// Mutation hooks for wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('wishlist')
        .insert([{ user_id: user.id, product_id: productId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: "Success",
        description: "Added to wishlist",
      });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({
          title: "Info",
          description: "Item already in wishlist",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to wishlist",
          variant: "destructive",
        });
      }
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: "Success",
        description: "Removed from wishlist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      });
    },
  });
};

// Mutation hooks for prescriptions
export const useAddPrescription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (prescription: Omit<Prescription, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'upload_date'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([{ ...prescription, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', user?.id] });
      toast({
        title: "Success",
        description: "Prescription uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload prescription",
        variant: "destructive",
      });
    },
  });
};