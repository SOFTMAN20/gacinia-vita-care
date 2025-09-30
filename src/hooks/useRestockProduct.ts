import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRestockProduct = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const restockProduct = async (
    productId: string, 
    newStockCount: number,
    reference?: string,
    reason?: string
  ) => {
    try {
      setLoading(true);
      
      // Get current stock to calculate difference
      const { data: currentProduct } = await supabase
        .from('products')
        .select('stock_count, name')
        .eq('id', productId)
        .single();

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

      // Log stock movement if there's a change
      if (currentProduct && newStockCount !== currentProduct.stock_count) {
        const quantityChange = newStockCount - currentProduct.stock_count;
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('stock_movements').insert({
          product_id: productId,
          type: 'in',
          quantity: quantityChange,
          reason: reason || 'Stock replenishment',
          reference: reference,
          user_id: user?.id,
        });
      }

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