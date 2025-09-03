import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const ProductDetail = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Product Detail
          </h1>
          <p className="text-muted-foreground">
            This page will show detailed product information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;