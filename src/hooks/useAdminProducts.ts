import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useOptimisticProducts } from './useOptimisticProducts';

export type AdminProduct = Tables<'products'> & {
  category?: Tables<'categories'>;
};

export interface CreateProductData {
  name: string;
  description?: string;
  short_description?: string;
  category_id: string;
  brand?: string;
  sku?: string;
  price: number;
  original_price?: number;
  wholesale_price?: number;
  image_url?: string;
  images?: string[];
  in_stock?: boolean;
  stock_count: number;
  min_stock_level: number;
  requires_prescription?: boolean;
  wholesale_available?: boolean;
  rating?: number;
  review_count?: number;
  key_features?: string[];
  technical_specs?: any;
  usage_instructions?: string;
  dosage?: string;
  ingredients?: string;
  storage_requirements?: string;
  expiry_date?: string;
  batch_number?: string;
  manufacturer?: string;
  weight?: string;
  dimensions?: string;
  is_active?: boolean;
  featured?: boolean;
}

export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const optimistic = useOptimisticProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductData) => {
    console.log('🔥 useAdminProducts createProduct called with:', productData);
    
    // Bypass optimistic updates for now to debug
    try {
      const finalProductData = {
        ...productData,
        is_active: productData.is_active !== false,
        in_stock: productData.stock_count > 0,
        featured: Boolean(productData.featured),
      };
      
      console.log('🔥 Final product data for Supabase:', finalProductData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([finalProductData])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) {
        console.error('🔥 Supabase error creating product:', error);
        throw error;
      }
      
      console.log('🔥 Product created successfully:', data);
      
      // Update local state
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('🔥 Error in createProduct:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<CreateProductData>) => {
    return optimistic.updateProductOptimistic(id, productData, async () => {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;
      
      // Update local state
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    });
  };

  const deleteProduct = async (id: string) => {
    return optimistic.deleteProductOptimistic(id, async () => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== id));
    });
  };

  const toggleProductStatus = async (id: string, isActive: boolean) => {
    return optimistic.toggleProductStatusOptimistic(id, isActive, async () => {
      return updateProduct(id, { is_active: isActive });
    });
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    refetch: fetchProducts,
  };
}