import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Product } from '@/hooks/useProducts';
import { toast } from 'sonner';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

interface RealtimeState {
  status: ConnectionStatus;
  lastConnected: Date | null;
  retryCount: number;
  error: string | null;
}

export function useRealtimeProducts() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<RealtimeState>({
    status: 'disconnected',
    lastConnected: null,
    retryCount: 0,
    error: null,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  // Exponential backoff calculation
  const getRetryDelay = useCallback((retryCount: number) => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
    return delay + Math.random() * 1000; // Add jitter
  }, []);

  // Update product in cache optimistically
  const updateProductOptimistic = useCallback((product: Partial<Product> & { id: string }) => {
    console.log('🔄 Optimistic update for product:', product.id);
    
    // Update products list
    queryClient.setQueryData(['products'], (oldData: any) => {
      if (!oldData?.pages) return oldData;
      
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data?.map((p: Product) => 
            p.id === product.id ? { ...p, ...product } : p
          )
        }))
      };
    });

    // Update individual product query
    queryClient.setQueryData(['product', product.id], (oldData: Product) => 
      oldData ? { ...oldData, ...product } : oldData
    );

    // Update featured products if applicable
    if (product.featured) {
      queryClient.setQueryData(['featured-products'], (oldData: Product[]) =>
        oldData?.map(p => p.id === product.id ? { ...p, ...product } : p) || oldData
      );
    }
  }, [queryClient]);

  // Handle product changes from realtime
  const handleProductChange = useCallback((payload: RealtimePostgresChangesPayload<Product>) => {
    console.log('📦 Realtime product change:', payload.eventType, payload);

    switch (payload.eventType) {
      case 'INSERT':
        if (payload.new) {
          console.log('➕ New product added:', payload.new.name);
          
          // Invalidate products list to refetch
          queryClient.invalidateQueries({ queryKey: ['products'] });
          
          // Add to featured products if featured
          if (payload.new.featured) {
            queryClient.invalidateQueries({ queryKey: ['featured-products'] });
          }
          
          toast.success(`New product available: ${payload.new.name}`, {
            action: {
              label: 'View',
              onClick: () => window.open(`/products/${payload.new.id}`, '_blank')
            }
          });
        }
        break;

      case 'UPDATE':
        if (payload.new && payload.old) {
          console.log('✏️ Product updated:', payload.new.name);
          updateProductOptimistic(payload.new);
          
          // Show notification for significant changes
          const stockChanged = payload.old.stock_count !== payload.new.stock_count;
          const priceChanged = payload.old.price !== payload.new.price;
          const statusChanged = payload.old.is_active !== payload.new.is_active;
          
          if (stockChanged || priceChanged || statusChanged) {
            let message = `${payload.new.name} updated`;
            if (stockChanged) message += ` (Stock: ${payload.new.stock_count})`;
            if (priceChanged) message += ` (Price: TSh ${payload.new.price.toLocaleString()})`;
            if (statusChanged) message += ` (${payload.new.is_active ? 'Active' : 'Inactive'})`;
            
            toast.info(message);
          }
        }
        break;

      case 'DELETE':
        if (payload.old) {
          console.log('🗑️ Product deleted:', payload.old.name);
          
          // Remove from all caches
          queryClient.removeQueries({ queryKey: ['product', payload.old.id] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['featured-products'] });
          
          toast.error(`Product removed: ${payload.old.name}`);
        }
        break;
    }
  }, [queryClient, updateProductOptimistic]);

  // Connect to realtime
  const connect = useCallback(() => {
    if (channelRef.current) {
      console.log('🔌 Already connected to realtime');
      return;
    }

    console.log('🔌 Connecting to products realtime...');
    setState(prev => ({ ...prev, status: 'connecting', error: null }));

    try {
      const channel = supabase
        .channel('products-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products'
          },
          handleProductChange
        )
        .subscribe((status) => {
          console.log('📡 Realtime subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            setState(prev => ({
              ...prev,
              status: 'connected',
              lastConnected: new Date(),
              retryCount: 0,
              error: null
            }));
            console.log('✅ Connected to products realtime');
          } else if (status === 'CHANNEL_ERROR') {
            setState(prev => ({
              ...prev,
              status: 'error',
              error: 'Failed to subscribe to realtime channel'
            }));
            console.error('❌ Realtime subscription failed');
            scheduleReconnect();
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('❌ Error connecting to realtime:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
      scheduleReconnect();
    }
  }, [handleProductChange]);

  // Disconnect from realtime
  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (channelRef.current) {
      console.log('🔌 Disconnecting from realtime');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setState(prev => ({ ...prev, status: 'disconnected' }));
  }, []);

  // Schedule reconnection with backoff
  const scheduleReconnect = useCallback(() => {
    if (retryTimeoutRef.current) return;
    if (!isVisibleRef.current) return; // Don't retry if tab is not visible

    setState(prev => {
      const newRetryCount = prev.retryCount + 1;
      const delay = getRetryDelay(newRetryCount);
      
      console.log(`⏱️ Scheduling reconnect #${newRetryCount} in ${delay}ms`);
      
      retryTimeoutRef.current = setTimeout(() => {
        retryTimeoutRef.current = null;
        setState(s => ({ ...s, status: 'reconnecting' }));
        disconnect();
        connect();
      }, delay);

      return { ...prev, retryCount: newRetryCount };
    });
  }, [getRetryDelay, connect, disconnect]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnect requested');
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setState(prev => ({ ...prev, retryCount: 0 }));
    disconnect();
    connect();
  }, [connect, disconnect]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      
      if (!document.hidden && state.status === 'disconnected') {
        console.log('👀 Tab became visible, reconnecting...');
        connect();
      } else if (document.hidden) {
        console.log('🙈 Tab became hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.status, connect]);

  // Handle online/offline
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Back online, reconnecting...');
      connect();
    };

    const handleOffline = () => {
      console.log('📴 Gone offline');
      setState(prev => ({ ...prev, status: 'disconnected', error: 'No internet connection' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect]);

  // Initialize connection
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    status: state.status,
    lastConnected: state.lastConnected,
    retryCount: state.retryCount,
    error: state.error,
    reconnect,
    disconnect,
    isConnected: state.status === 'connected',
    isConnecting: state.status === 'connecting' || state.status === 'reconnecting',
  };
}