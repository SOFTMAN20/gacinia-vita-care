import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Category = Tables<'categories'>;

// Fallback categories for when database is not available
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Prescription Medicines',
    name_swahili: 'Dawa za Prescription',
    slug: 'prescription-medicines',
    description: 'Medicines requiring valid prescription',
    image_url: '/placeholder-category.jpg',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Over-the-Counter',
    name_swahili: 'Dawa za Kawaida',
    slug: 'over-the-counter',
    description: 'Non-prescription medicines',
    image_url: '/placeholder-category.jpg',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Cosmetics & Personal Care',
    name_swahili: 'Vipodozi na Mahitaji ya Kibinafsi',
    slug: 'cosmetics-personal-care',
    description: 'Beauty and personal care products',
    image_url: '/placeholder-category.jpg',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Medical Equipment',
    name_swahili: 'Vifaa vya Kidaktari',
    slug: 'medical-equipment',
    description: 'Medical devices and equipment',
    image_url: '/placeholder-category.jpg',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'First Aid & Wellness',
    name_swahili: 'Huduma za Kwanza na Afya',
    slug: 'first-aid-wellness',
    description: 'First aid supplies and wellness products',
    image_url: '/placeholder-category.jpg',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        throw error;
      }

      // Use database data if available, otherwise keep fallback
      if (data && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      // Keep fallback categories on error
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          throw error;
        }

        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return {
    category,
    loading,
    error,
  };
}