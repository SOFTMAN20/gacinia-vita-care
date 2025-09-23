import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/providers/RealtimeProvider';

interface StockUpdate {
  product_id: string;
  product_name: string;
  old_stock: number;
  new_stock: number;
  change: number;
}

export const useRealtimeStock = () => {
  const { toast } = useToast();

  // Handle stock update notifications
  const handleStockUpdate = useCallback((payload: any) => {
    const { old: oldProduct, new: newProduct } = payload;
    
    if (!oldProduct || !newProduct) return;
    
    const stockChange = newProduct.stock_count - oldProduct.stock_count;
    
    // Only show notifications for significant stock changes
    if (Math.abs(stockChange) > 0) {
      const stockUpdate: StockUpdate = {
        product_id: newProduct.id,
        product_name: newProduct.name,
        old_stock: oldProduct.stock_count,
        new_stock: newProduct.stock_count,
        change: stockChange
      };
      
      console.log('Stock update detected:', stockUpdate);
      
      // Invalidate product queries to refetch with new stock data
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
      
      // Show toast for significant stock decreases (likely from orders)
      if (stockChange < 0) {
        toast({
          title: 'Stock Updated',
          description: `${stockUpdate.product_name} stock decreased by ${Math.abs(stockChange)} units`,
        });
      }
      
      // Show warning for low stock
      if (newProduct.stock_count <= (newProduct.min_stock_level || 5) && newProduct.stock_count > 0) {
        toast({
          title: 'Low Stock Alert',
          description: `${stockUpdate.product_name} is running low (${newProduct.stock_count} remaining)`,
          variant: 'destructive',
        });
      }
      
      // Show alert for out of stock
      if (newProduct.stock_count === 0 && oldProduct.stock_count > 0) {
        toast({
          title: 'Out of Stock',
          description: `${stockUpdate.product_name} is now out of stock`,
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  useEffect(() => {
    console.log('Setting up real-time stock monitoring...');
    
    // Subscribe to product changes
    const channel = supabase
      .channel('stock-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        handleStockUpdate
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time stock monitoring...');
      supabase.removeChannel(channel);
    };
  }, [handleStockUpdate]);

  return {
    // This hook primarily handles side effects, but we can expose utilities if needed
    invalidateProductQueries: () => {
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
    }
  };
};