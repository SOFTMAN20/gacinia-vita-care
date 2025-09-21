import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useCartItems } from '@/hooks/useCartItems';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
  prescriptionUploaded?: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'APPLY_DISCOUNT'; payload: number }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const TAX_RATE = 0; // 0% tax for now
const DELIVERY_FEE = 0; // Free delivery for now

const calculateCartTotals = (items: CartItem[], discount: number = 0) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const deliveryFee = totalItems > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee - discount;

  return {
    totalItems,
    subtotal,
    tax,
    deliveryFee,
    total: Math.max(0, total)
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_count || 99) }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            id: product.id,
            product,
            quantity: Math.min(quantity, product.stock_count || 99),
            addedAt: new Date(),
            prescriptionUploaded: !product.requires_prescription
          }
        ];
      }

      const totals = calculateCartTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateCartTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const newItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.product.stock_count || 99) }
          : item
      );
      const totals = calculateCartTotals(newItems, state.discount);
      return { ...state, items: newItems, ...totals };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        totalItems: 0,
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0
      };
    }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };

    case 'APPLY_DISCOUNT': {
      const totals = calculateCartTotals(state.items, action.payload);
      return { ...state, discount: action.payload, ...totals };
    }

    case 'LOAD_CART': {
      const totals = calculateCartTotals(action.payload, state.discount);
      return { ...state, items: action.payload, ...totals };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  applyDiscount: (amount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartItems, addCartItem, updateCartItem, removeCartItem, clearCart: clearBackendCart, loading } = useCartItems();

  // Sync backend cart items with local state
  useEffect(() => {
    if (cartItems.length > 0) {
      const transformedItems = cartItems.map(item => ({
        id: item.product_id,
        product: item.product as Product,
        quantity: item.quantity,
        addedAt: new Date(item.created_at),
        prescriptionUploaded: !item.product?.requires_prescription
      }));
      dispatch({ type: 'LOAD_CART', payload: transformedItems });
    } else if (!loading && user) {
      // Clear cart if no items and user is logged in
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [cartItems, loading, user]);

  // Load cart from localStorage for guest users
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem('gacinia-cart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('gacinia-cart', JSON.stringify(state.items));
    }
  }, [state.items, user]);

  const addItem = async (product: Product, quantity: number = 1) => {
    if (!product.in_stock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (user) {
        // For authenticated users, use backend
        await addCartItem(product.id, quantity);
      } else {
        // For guest users, use local state
        dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
      }
      
      toast({
        title: "Added to Cart",
        description: `${quantity}x ${product.name} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (productId: string) => {
    const item = state.items.find(item => item.id === productId);
    
    try {
      if (user) {
        // Find the cart item by product ID
        const cartItem = cartItems.find(ci => ci.product_id === productId);
        if (cartItem) {
          await removeCartItem(cartItem.id);
        }
      } else {
        // For guest users, use local state
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
      }
      
      if (item) {
        toast({
          title: "Removed from Cart",
          description: `${item.product.name} removed from your cart.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (user) {
        // Find the cart item by product ID
        const cartItem = cartItems.find(ci => ci.product_id === productId);
        if (cartItem) {
          await updateCartItem(cartItem.id, quantity);
        }
      } else {
        // For guest users, use local state
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await clearBackendCart();
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
      
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  };

  const applyDiscount = (amount: number) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: amount });
    toast({
      title: "Discount Applied",
      description: `TZS ${amount.toLocaleString()} discount applied to your order.`,
    });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        applyDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};