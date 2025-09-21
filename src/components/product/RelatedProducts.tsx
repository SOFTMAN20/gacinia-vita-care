// Simple stub component that works with the new Product interface
import { Product } from '@/hooks/useProducts';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // For now, return a simple message until we have proper related products
  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-4">Related Products</h3>
      <p className="text-muted-foreground">
        Related products will be shown here based on category: {category}
      </p>
    </div>
  );
}