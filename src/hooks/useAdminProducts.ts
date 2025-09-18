import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev => [data, ...prev]);
      toast.success('Product created successfully');
      return data;
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<CreateProductData>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Product updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: string, isActive: boolean) => {
    try {
      await updateProduct(id, { is_active: isActive });
    } catch (err) {
      // Error handling is done in updateProduct
    }
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