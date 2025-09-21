import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';

// Create a client with optimized settings for real-time updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: false, // We rely on real-time updates
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export { queryClient };