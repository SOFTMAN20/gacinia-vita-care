import React, { useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSet?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  fallback = '/placeholder.svg', 
  className = '',
  loading = 'lazy',
  sizes,
  srcSet,
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallback);
    }
  }, [hasError, fallback]);

  // Update src when prop changes
  React.useEffect(() => {
    setImageSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Generate optimized URLs for Supabase Storage
  const getOptimizedUrl = (url: string, width?: number) => {
    if (url.includes('supabase') && width) {
      return `${url}?width=${width}&quality=80`;
    }
    return url;
  };

  const optimizedSrc = sizes ? getOptimizedUrl(imageSrc, 800) : imageSrc;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        srcSet={srcSet}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } w-full h-full object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}