import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock_count: number;
  min_stock_level: number;
  category_name?: string;
  image_url?: string;
  price: number;
}

export const useLowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          stock_count,
          min_stock_level,
          image_url,
          price,
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .or('stock_count.lte.min_stock_level,stock_count.eq.0')
        .order('stock_count', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedData: LowStockProduct[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku || '',
        stock_count: product.stock_count || 0,
        min_stock_level: product.min_stock_level || 5,
        category_name: product.categories?.name,
        image_url: product.image_url,
        price: product.price || 0
      }));

      setLowStockProducts(formattedData);
    } catch (err) {
      console.error('Error fetching low stock products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch low stock alerts';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load low stock alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();

    // Set up real-time subscription for product stock changes
    const channel = supabase
      .channel('low-stock-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Product stock update detected:', payload);
          // Refetch low stock products when any product is updated
          fetchLowStockProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    lowStockProducts,
    loading,
    error,
    refetch: fetchLowStockProducts
  };
};