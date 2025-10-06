import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface StockMetrics {
  totalProducts: number;
  totalValue: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface InventoryProduct extends Tables<'products'> {
  category?: Tables<'categories'>;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  reason: string;
  reference: string | null;
  user_id: string | null;
  created_at: string;
  product?: {
    name: string;
    sku: string | null;
  };
}

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
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const [stockMetrics, setStockMetrics] = useState<StockMetrics>({
    totalProducts: 0,
    totalValue: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<InventoryProduct[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<InventoryProduct[]>([]);
  const [recentMovements, setRecentMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Legacy format for InventoryManager component
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    reorderLevel: 0,
    totalValue: 0
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with categories
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name', { ascending: true });

      if (productsError) throw productsError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Fetch recent stock movements
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          product:products(name, sku)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (movementsError) throw movementsError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setRecentMovements(movementsData || []);

      // Calculate metrics
      const totalProducts = productsData?.length || 0;
      const inStock = productsData?.filter(p => p.stock_count && p.stock_count > p.min_stock_level).length || 0;
      const lowStock = productsData?.filter(p => 
        p.stock_count && p.stock_count > 0 && p.stock_count <= p.min_stock_level
      ).length || 0;
      const outOfStock = productsData?.filter(p => !p.stock_count || p.stock_count === 0).length || 0;
      const reorderLevel = productsData?.filter(p => 
        p.stock_count && p.stock_count > 0 && p.stock_count <= p.min_stock_level * 1.5
      ).length || 0;
      const totalValue = productsData?.reduce((sum, p) => 
        sum + (p.price * (p.stock_count || 0)), 0
      ) || 0;

      setStockMetrics({
        totalProducts,
        totalValue,
        inStock,
        lowStock,
        outOfStock,
      });

      // Set legacy stats for InventoryManager
      setStats({
        totalItems: totalProducts,
        lowStock,
        outOfStock,
        reorderLevel,
        totalValue
      });

      // Transform products to legacy inventory items format
      const items: InventoryItem[] = (productsData || []).map(product => {
        let status: InventoryItem['status'] = 'in_stock';
        
        if (product.stock_count === 0) {
          status = 'out_of_stock';
        } else if (product.stock_count && product.stock_count <= product.min_stock_level) {
          status = 'low_stock';
        } else if (product.stock_count && product.stock_count <= product.min_stock_level * 1.5) {
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
          lastUpdated: product.updated_at || new Date().toISOString(),
          status,
          batchNumber: product.batch_number || undefined,
          expiryDate: product.expiry_date || undefined,
          location: 'Main Store',
          supplier: 'Various'
        };
      });

      setInventoryItems(items);

      // Set low stock products
      const lowStockItems = productsData?.filter(p => 
        p.stock_count && p.stock_count > 0 && p.stock_count <= p.min_stock_level
      ) || [];
      setLowStockProducts(lowStockItems);

      // Set expiring products (products with expiry date within 90 days)
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
      
      const expiringItems = productsData?.filter(p => {
        if (!p.expiry_date) return false;
        const expiryDate = new Date(p.expiry_date);
        return expiryDate <= ninetyDaysFromNow && expiryDate > new Date();
      }) || [];
      setExpiringProducts(expiringItems);

    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchInventoryData();
  }, []);

  return {
    // New format for standalone Inventory page
    products,
    categories,
    stockMetrics,
    lowStockProducts,
    expiringProducts,
    recentMovements,
    // Legacy format for InventoryManager component
    stats,
    inventoryItems,
    // Common
    loading,
    error,
    refetch: fetchInventoryData,
    updateProductStock
  };
}