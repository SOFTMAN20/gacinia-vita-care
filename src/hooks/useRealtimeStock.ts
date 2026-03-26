import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/providers/RealtimeProvider';
import { useAuth } from '@/contexts/AuthContext';

interface StockUpdate {
  product_id: string;
  product_name: string;
  old_stock: number;
  new_stock: number;
  change: number;
}

export const useRealtimeStock = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  // Handle stock update notifications
  const handleStockUpdate = useCallback((payload: any) => {
    const { old: oldProduct, new: newProduct } = payload;
    
    if (!oldProduct || !newProduct) return;
    
    const stockChange = newProduct.stock_count - oldProduct.stock_count;
    
    if (Math.abs(stockChange) > 0) {
      console.log('Stock update detected:', {
        product_name: newProduct.name,
        old_stock: oldProduct.stock_count,
        new_stock: newProduct.stock_count,
        change: stockChange
      });
      
      // Invalidate product queries to refetch with new stock data
      queryClient.invalidateQueries({
        queryKey: ['products']
      });
      
      // Only show stock notifications to admins - check profile directly
      const currentIsAdmin = profile?.role === 'admin';
      if (currentIsAdmin) {
        if (stockChange < 0) {
          toast({
            title: 'Stock Updated',
            description: `${newProduct.name} stock decreased by ${Math.abs(stockChange)} units`,
          });
        }
        
        if (newProduct.stock_count <= (newProduct.min_stock_level || 5) && newProduct.stock_count > 0) {
          toast({
            title: 'Low Stock Alert',
            description: `${newProduct.name} is running low (${newProduct.stock_count} remaining)`,
            variant: 'destructive',
          });
        }
        
        if (newProduct.stock_count === 0 && oldProduct.stock_count > 0) {
          toast({
            title: 'Out of Stock',
            description: `${newProduct.name} is now out of stock`,
            variant: 'destructive',
          });
        }
      }
    }
  }, [toast, profile]);

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