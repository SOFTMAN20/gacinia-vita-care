import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCartCleanup = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Clean up expired cart items when component mounts
    const cleanupExpiredItems = async () => {
      try {
        await supabase.rpc('cleanup_expired_cart_items');
      } catch (error) {
        console.error('Error cleaning up expired cart items:', error);
      }
    };

    cleanupExpiredItems();

    // Set up periodic cleanup every 5 minutes
    const cleanupInterval = setInterval(cleanupExpiredItems, 5 * 60 * 1000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [user]);
};