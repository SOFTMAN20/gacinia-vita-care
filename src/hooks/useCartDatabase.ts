import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/contexts/CartContext';
import { Product } from '@/hooks/useProducts';

export const useCartDatabase = () => {
  const { user } = useAuth();

  const loadCartFromDatabase = async (): Promise<CartItem[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          created_at,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart from database:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.product_id,
        product: item.products as Product,
        quantity: item.quantity,
        addedAt: new Date(item.created_at),
        prescriptionUploaded: !item.products?.requires_prescription
      })) || [];
    } catch (error) {
      console.error('Error loading cart from database:', error);
      return [];
    }
  };

  const saveCartToDatabase = async (items: CartItem[]) => {
    if (!user) return;

    try {
      // First, clear existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Then insert new cart items
      if (items.length > 0) {
        const cartItems = items.map(item => ({
          user_id: user.id,
          product_id: item.id,
          quantity: item.quantity
        }));

        const { error } = await supabase
          .from('cart_items')
          .insert(cartItems);

        if (error) {
          console.error('Error saving cart to database:', error);
        }
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  const addItemToDatabase = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) console.error('Error updating cart item:', error);
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });

        if (error) console.error('Error adding cart item:', error);
      }
    } catch (error) {
      console.error('Error adding item to database:', error);
    }
  };

  const removeItemFromDatabase = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) console.error('Error removing cart item:', error);
    } catch (error) {
      console.error('Error removing item from database:', error);
    }
  };

  const updateItemQuantityInDatabase = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      if (quantity <= 0) {
        await removeItemFromDatabase(productId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) console.error('Error updating cart item quantity:', error);
    } catch (error) {
      console.error('Error updating item quantity in database:', error);
    }
  };

  const clearCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) console.error('Error clearing cart from database:', error);
    } catch (error) {
      console.error('Error clearing cart from database:', error);
    }
  };

  return {
    loadCartFromDatabase,
    saveCartToDatabase,
    addItemToDatabase,
    removeItemFromDatabase,
    updateItemQuantityInDatabase,
    clearCartFromDatabase
  };
};