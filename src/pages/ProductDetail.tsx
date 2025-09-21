import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { PurchaseOptions } from '@/components/product/PurchaseOptions';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { state } = useCart();
  
  // Find the product by ID
  const product = products?.find(p => p.id === id);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={state.totalItems} />
        <main className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Skeleton className="aspect-square w-full" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  // Use real product data with fallback images if needed
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.image_url || '/placeholder.svg',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
        'https://images.unsplash.com/photo-1585435557343-3b092031d8df?w=800',
        'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800'
      ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={state.totalItems} />
      
      <main className="container mx-auto px-4 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Product Images */}
          <div className="lg:col-span-5">
            <ProductImageGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* Product Information - Mobile: Full width, Desktop: 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            <ProductInfo product={product} />
          </div>

          {/* Purchase Options - Mobile: Full width, Desktop: 3 columns */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              <PurchaseOptions product={product} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            productId={product.id}
            averageRating={product.rating || 4.5}
            totalReviews={product.review_count || 75}
          />
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts
            currentProductId={product.id}
            category={product.category_id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;