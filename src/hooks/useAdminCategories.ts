import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type AdminCategory = Tables<'categories'> & {
  product_count: number;
};

interface CategoryFormData {
  name: string;
  name_swahili?: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories with product count
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products!inner(count)
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Transform the data to include product count
      const categoriesWithCount = data.map(category => ({
        ...category,
        product_count: category.products?.[0]?.count || 0
      }));

      setCategories(categoriesWithCount);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CategoryFormData) => {
    try {
      const slug = categoryData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          name_swahili: categoryData.name_swahili,
          description: categoryData.description,
          image_url: categoryData.image_url,
          is_active: categoryData.is_active,
          slug,
          sort_order: categories.length + 1
        })
        .select()
        .single();

      if (error) throw error;

      const newCategory = { ...data, product_count: 0 };
      setCategories(prev => [...prev, newCategory]);
      
      toast.success('Category created successfully');
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<CategoryFormData>) => {
    try {
      const updateData: any = { ...categoryData };
      
      if (categoryData.name) {
        updateData.slug = categoryData.name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => prev.map(cat => 
        cat.id === id 
          ? { ...cat, ...data }
          : cat
      ));
      
      toast.success('Category updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
      throw err;
    }
  };

  const toggleCategoryStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.map(cat => 
        cat.id === id 
          ? { ...cat, is_active: isActive }
          : cat
      ));
      
      toast.success(`Category ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error updating category status:', err);
      toast.error('Failed to update category status');
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    refetch: fetchCategories
  };
}