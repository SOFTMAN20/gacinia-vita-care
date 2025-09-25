import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number; // negative for out, positive for in
  reason: string;
  date: string; // YYYY-MM-DD
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

      // Pull recent order items as stock "out" movements
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          product_id,
          quantity,
          order:orders(
            id,
            created_at,
            order_number
          ),
          product:products(
            name
          )
        `)
        .order('created_at', { referencedTable: 'orders', ascending: false })
        .limit(50);

      if (error) throw error;

      const mapped: StockMovement[] = (data || []).map((row: any) => ({
        id: row.id,
        productId: row.product_id,
        productName: row.product?.name || 'Unknown Product',
        type: 'out',
        quantity: -Math.abs(row.quantity || 0),
        reason: 'Sale to customer',
        date: (row.order?.created_at || new Date().toISOString()).split('T')[0],
        user: 'Sales',
        reference: row.order?.order_number || undefined,
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
  }, []);

  return { movements, loading, error, refetch: fetchMovements };
}


