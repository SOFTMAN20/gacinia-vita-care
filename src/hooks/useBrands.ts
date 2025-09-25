import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type Brand = Tables<'brands'>;

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setBrands(data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([{
          name: name.trim(),
          description: description?.trim() || null,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBrands(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success(`Brand "${name}" created successfully`);
      return data;
    } catch (err) {
      console.error('Error creating brand:', err);
      const message = err instanceof Error ? err.message : 'Failed to create brand';
      toast.error(message);
      throw err;
    }
  };

  return {
    brands,
    loading,
    error,
    createBrand,
    refetch: fetchBrands,
  };
}