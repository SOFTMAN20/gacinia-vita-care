import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Products Catalog
          </h1>
          <p className="text-muted-foreground">
            This page will contain the complete product catalog with filtering and search.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;