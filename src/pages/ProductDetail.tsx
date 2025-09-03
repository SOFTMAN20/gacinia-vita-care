import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { PurchaseOptions } from '@/components/product/PurchaseOptions';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { sampleProducts } from '@/data/products';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the product by ID
  const product = sampleProducts.find(p => p.id === id);
  
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  // Enhanced product with additional sample data
  const enhancedProduct = {
    ...product,
    images: [
      product.image,
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
      'https://images.unsplash.com/photo-1585435557343-3b092031d8df?w=800',
      'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800'
    ],
    description: 'This is a high-quality pharmaceutical product designed to provide effective relief. Our medicines are sourced from trusted manufacturers and meet international quality standards. Each batch is carefully tested to ensure safety and efficacy.',
    keyFeatures: [
      'Fast-acting formula for quick relief',
      'Clinically tested and proven effective',
      'Safe for adults and children over 12',
      'Long-lasting protection up to 8 hours',
      'Easy to swallow tablets'
    ],
    technicalSpecs: {
      'Active Ingredient': 'Paracetamol 500mg',
      'Pack Size': '20 tablets',
      'Dosage Form': 'Film-coated tablets'
    },
    usageInstructions: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours. Take with water, preferably with or after food.',
    dosage: 'Adults and children over 12 years: 1-2 tablets every 4-6 hours. Maximum daily dose: 8 tablets (4000mg).',
    ingredients: 'Each tablet contains Paracetamol 500mg. Excipients: Microcrystalline cellulose, croscarmellose sodium, magnesium stearate.',
    storageRequirements: 'Store in a cool, dry place below 25°C. Keep out of reach of children. Do not use after expiry date.',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals',
    batchNumber: 'LOT2024001',
    expiryDate: 'December 2026',
    sku: 'GSK-PAR-500-20',
    weight: '15g',
    dimensions: '10cm x 6cm x 2cm',
    wholesalePrice: product.price * 0.8
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-5">
            <ProductImageGallery
              images={enhancedProduct.images}
              productName={enhancedProduct.name}
            />
          </div>

          {/* Product Information */}
          <div className="lg:col-span-4">
            <ProductInfo product={enhancedProduct} />
          </div>

          {/* Purchase Options */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <PurchaseOptions product={enhancedProduct} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            productId={product.id}
            averageRating={product.rating || 4.5}
            totalReviews={product.reviewCount || 75}
          />
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts
            currentProductId={product.id}
            category={product.category}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;