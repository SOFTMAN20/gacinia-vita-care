import React, { Suspense, lazy } from 'react';
import { Skeleton } from './skeleton';

interface LazyComponentProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export function LazyComponent({ 
  importFunc, 
  fallback = <Skeleton className="w-full h-48" />,
  ...props 
}: LazyComponentProps) {
  const Component = lazy(importFunc);

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

// Pre-configured lazy components for common use cases
export const LazyProductGrid = (props: any) => (
  <LazyComponent 
    importFunc={() => import('@/components/catalog/ProductGrid')}
    fallback={
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    }
    {...props}
  />
);

export const LazyFeaturedProducts = (props: any) => (
  <LazyComponent 
    importFunc={() => import('@/components/home/FeaturedProducts')}
    fallback={<Skeleton className="w-full h-96" />}
    {...props}
  />
);

export const LazyCategoryGrid = (props: any) => (
  <LazyComponent 
    importFunc={() => import('@/components/home/CategoryGrid')}
    fallback={
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    }
    {...props}
  />
);