import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductFilters, FilterState } from '@/components/catalog/ProductFilters';
import { ProductSort, SortOption } from '@/components/catalog/ProductSort';
import { ProductGrid, ViewMode } from '@/components/catalog/ProductGrid';
import { ProductSearch } from '@/components/catalog/ProductSearch';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sampleProducts } from '@/data/products';
import { Product } from '@/components/ui/product-card';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    availability: [],
    special: []
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let products = [...sampleProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      products = products.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply price range filter
    products = products.filter(product =>
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Apply availability filter
    if (filters.availability.length > 0) {
      products = products.filter(product => {
        if (filters.availability.includes('in-stock') && product.inStock && (product.stockCount || 0) > 5) return true;
        if (filters.availability.includes('low-stock') && product.inStock && (product.stockCount || 0) <= 5) return true;
        if (filters.availability.includes('out-of-stock') && !product.inStock) return true;
        return false;
      });
    }

    // Apply special filters
    if (filters.special.length > 0) {
      products = products.filter(product => {
        if (filters.special.includes('prescription') && product.requiresPrescription) return true;
        if (filters.special.includes('wholesale') && product.wholesaleAvailable) return true;
        if (filters.special.includes('on-sale') && product.originalPrice) return true;
        return false;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      case 'best-selling':
      case 'relevance':
      default:
        // Keep original order for now
        break;
    }

    return products;
  }, [searchQuery, filters, sortBy]);

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    // TODO: Implement cart functionality
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
    // TODO: Implement quick view modal
  };

  const handleToggleWishlist = (product: Product) => {
    console.log('Toggle wishlist:', product);
    // TODO: Implement wishlist functionality
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      availability: [],
      special: []
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Products Catalog
          </h1>
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            suggestions={['Panadol Extra', 'Blood pressure monitor', 'Vitamin C tablets']}
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile Filters Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  isMobile
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} products found
              </p>
              <ProductSort
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={filteredAndSortedProducts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;