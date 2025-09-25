import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRestockProduct = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const restockProduct = async (productId: string, newStockCount: number) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock_count: newStockCount,
          in_stock: newStockCount > 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product stock updated to ${newStockCount} units`,
      });

      return data;
    } catch (error) {
      console.error('Error restocking product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update stock';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    restockProduct,
    loading
  };
};