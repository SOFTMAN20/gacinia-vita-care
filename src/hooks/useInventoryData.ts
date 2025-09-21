import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface InventoryStats {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  reorderLevel: number;
  totalValue: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  price: number;
  category: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reorder';
  supplier?: string;
  location?: string;
  expiryDate?: string;
  batchNumber?: string;
}

export function useInventoryData() {
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    reorderLevel: 0,
    totalValue: 0
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with categories
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          price,
          stock_count,
          min_stock_level,
          batch_number,
          updated_at,
          category:categories(name)
        `)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (productsError) throw productsError;

      // Transform products to inventory items
      const items: InventoryItem[] = (products || []).map(product => {
        let status: InventoryItem['status'] = 'in_stock';
        
        if (product.stock_count === 0) {
          status = 'out_of_stock';
        } else if (product.stock_count <= product.min_stock_level) {
          status = 'low_stock';
        } else if (product.stock_count <= product.min_stock_level * 1.5) {
          status = 'reorder';
        }

        return {
          id: product.id,
          name: product.name,
          sku: product.sku || `SKU-${product.id.slice(-8)}`,
          currentStock: product.stock_count || 0,
          minStock: product.min_stock_level || 5,
          price: Number(product.price) || 0,
          category: product.category?.name || 'Uncategorized',
          lastUpdated: product.updated_at,
          status,
          batchNumber: product.batch_number || undefined,
          location: 'Main Store', // Default location
          supplier: 'Various' // Default supplier
        };
      });

      setInventoryItems(items);

      // Calculate stats
      const totalItems = items.length;
      const lowStock = items.filter(item => item.status === 'low_stock').length;
      const outOfStock = items.filter(item => item.status === 'out_of_stock').length;
      const reorderLevel = items.filter(item => item.status === 'reorder').length;
      const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

      setStats({
        totalItems,
        lowStock,
        outOfStock,
        reorderLevel,
        totalValue
      });

    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const updateProductStock = async (productId: string, newStockCount: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_count: newStockCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      // Refresh data after update
      await fetchInventoryData();
      
      return { success: true };
    } catch (err) {
      console.error('Error updating stock:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update stock' 
      };
    }
  };

  return {
    stats,
    inventoryItems,
    loading,
    error,
    refetch: fetchInventoryData,
    updateProductStock
  };
}