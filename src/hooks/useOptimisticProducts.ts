import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Product } from '@/hooks/useProducts';
import { CreateProductData } from '@/hooks/useAdminProducts';
import { toast } from 'sonner';

export function useOptimisticProducts() {
  const queryClient = useQueryClient();

  // Optimistically add a new product
  const addProductOptimistic = useCallback(async (
    productData: CreateProductData,
    mutationFn: () => Promise<Product>
  ) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticProduct: Product = {
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: productData.name || '',
      description: productData.description || '',
      short_description: productData.short_description || '',
      category_id: productData.category_id || '',
      brand: productData.brand || '',
      sku: productData.sku || '',
      price: productData.price || 0,
      original_price: productData.original_price || null,
      wholesale_price: productData.wholesale_price || null,
      image_url: productData.image_url || '',
      images: productData.images || [],
      in_stock: productData.in_stock ?? true,
      stock_count: productData.stock_count || 0,
      min_stock_level: productData.min_stock_level || 5,
      requires_prescription: productData.requires_prescription ?? false,
      wholesale_available: productData.wholesale_available ?? false,
      rating: productData.rating || 0,
      review_count: productData.review_count || 0,
      key_features: productData.key_features || [],
      technical_specs: productData.technical_specs || null,
      usage_instructions: productData.usage_instructions || '',
      dosage: productData.dosage || '',
      ingredients: productData.ingredients || '',
      storage_requirements: productData.storage_requirements || '',
      expiry_date: productData.expiry_date || '',
      batch_number: productData.batch_number || '',
      manufacturer: productData.manufacturer || '',
      weight: productData.weight || '',
      dimensions: productData.dimensions || '',
      is_active: productData.is_active ?? true,
      featured: productData.featured ?? false,
      category: null, // Will be populated by the real response
    };

    // Show optimistic toast
    toast.loading('Adding product...', { id: tempId });

    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['products'] });

    // Snapshot previous value
    const previousProducts = queryClient.getQueryData(['products']);

    // Optimistically update cache
    queryClient.setQueryData(['products'], (old: any) => {
      if (!old?.pages) return old;
      
      const firstPage = old.pages[0];
      if (!firstPage) return old;

      return {
        ...old,
        pages: [
          {
            ...firstPage,
            data: [optimisticProduct, ...(firstPage.data || [])]
          },
          ...old.pages.slice(1)
        ]
      };
    });

    try {
      // Perform the actual mutation
      const newProduct = await mutationFn();
      
      // Update cache with real data
      queryClient.setQueryData(['products'], (old: any) => {
        if (!old?.pages) return old;
        
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((p: Product) => 
              p.id === tempId ? newProduct : p
            ) || []
          }))
        };
      });

      // Update featured products if applicable
      if (newProduct.featured) {
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      }

      toast.success('Product added successfully!', { id: tempId });
      return newProduct;

    } catch (error) {
      // Revert optimistic update
      queryClient.setQueryData(['products'], previousProducts);
      
      toast.error('Failed to add product', { id: tempId });
      throw error;
    }
  }, [queryClient]);

  // Optimistically update an existing product
  const updateProductOptimistic = useCallback(async (
    productId: string,
    updates: Partial<CreateProductData>,
    mutationFn: () => Promise<Product>
  ) => {
    const toastId = `update-${productId}`;
    toast.loading('Updating product...', { id: toastId });

    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['products'] });
    await queryClient.cancelQueries({ queryKey: ['product', productId] });

    // Snapshot previous values
    const previousProducts = queryClient.getQueryData(['products']);
    const previousProduct = queryClient.getQueryData(['product', productId]);

    // Optimistically update caches
    queryClient.setQueryData(['products'], (old: any) => {
      if (!old?.pages) return old;
      
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data?.map((p: Product) => 
            p.id === productId 
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p
          ) || []
        }))
      };
    });

    queryClient.setQueryData(['product', productId], (old: Product) => 
      old ? { ...old, ...updates, updated_at: new Date().toISOString() } : old
    );

    try {
      // Perform the actual mutation
      const updatedProduct = await mutationFn();

      // Update caches with real data
      queryClient.setQueryData(['products'], (old: any) => {
        if (!old?.pages) return old;
        
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data?.map((p: Product) => 
              p.id === productId ? updatedProduct : p
            ) || []
          }))
        };
      });

      queryClient.setQueryData(['product', productId], updatedProduct);

      // Update featured products if applicable
      if (updatedProduct.featured || updates.featured !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      }

      toast.success('Product updated successfully!', { id: toastId });
      return updatedProduct;

    } catch (error) {
      // Revert optimistic updates
      queryClient.setQueryData(['products'], previousProducts);
      queryClient.setQueryData(['product', productId], previousProduct);
      
      toast.error('Failed to update product', { id: toastId });
      throw error;
    }
  }, [queryClient]);

  // Optimistically delete a product
  const deleteProductOptimistic = useCallback(async (
    productId: string,
    mutationFn: () => Promise<void>
  ) => {
    const toastId = `delete-${productId}`;
    toast.loading('Deleting product...', { id: toastId });

    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['products'] });

    // Snapshot previous value
    const previousProducts = queryClient.getQueryData(['products']);

    // Optimistically remove from cache
    queryClient.setQueryData(['products'], (old: any) => {
      if (!old?.pages) return old;
      
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data?.filter((p: Product) => p.id !== productId) || []
        }))
      };
    });

    // Remove individual product query
    queryClient.removeQueries({ queryKey: ['product', productId] });

    try {
      // Perform the actual mutation
      await mutationFn();

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      
      toast.success('Product deleted successfully!', { id: toastId });

    } catch (error) {
      // Revert optimistic update
      queryClient.setQueryData(['products'], previousProducts);
      
      toast.error('Failed to delete product', { id: toastId });
      throw error;
    }
  }, [queryClient]);

  // Optimistically toggle product status
  const toggleProductStatusOptimistic = useCallback(async (
    productId: string,
    newStatus: boolean,
    mutationFn: () => Promise<Product>
  ) => {
    return updateProductOptimistic(
      productId,
      { is_active: newStatus },
      mutationFn
    );
  }, [updateProductOptimistic]);

  return {
    addProductOptimistic,
    updateProductOptimistic,
    deleteProductOptimistic,
    toggleProductStatusOptimistic,
  };
}