import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  user: string;
  reference?: string;
};

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from stock_movements table with product details
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          id,
          product_id,
          type,
          quantity,
          reason,
          reference,
          created_at,
          user_id,
          product:products(
            name
          ),
          profile:profiles(
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mapped: StockMovement[] = (data || []).map((row: any) => ({
        id: row.id,
        productId: row.product_id,
        productName: row.product?.name || 'Unknown Product',
        type: row.type,
        quantity: row.quantity,
        reason: row.reason,
        date: row.created_at.split('T')[0],
        user: row.profile?.full_name || 'System',
        reference: row.reference || undefined,
      }));

      setMovements(mapped);
    } catch (err) {
      console.error('Error fetching stock movements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock movements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();

    // Set up real-time subscription for stock movements
    const channel = supabase
      .channel('stock-movements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_movements'
        },
        () => {
          console.log('Stock movement detected, refetching...');
          fetchMovements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { movements, loading, error, refetch: fetchMovements };
}


