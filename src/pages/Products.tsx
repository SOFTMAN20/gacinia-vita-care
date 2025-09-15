import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useCart } from '@/contexts/CartContext';

const Products = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { addItem } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 100000] as [number, number],
    availability: [],
    special: []
  });

  // Handle URL parameters for category filtering and search
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const wholesaleParam = searchParams.get('wholesale');
    const searchParam = searchParams.get('search');
    
    const newFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 100000] as [number, number],
      availability: [],
      special: []
    };
    
    // Handle category filtering
    if (categoryParam) {
      const categories = categoryParam.split(',');
      newFilters.categories = categories;
    } else if (category) {
      newFilters.categories = [category];
    }
    
    // Handle wholesale filtering
    if (wholesaleParam === 'true') {
      newFilters.special = ['wholesale'];
    }
    
    // Handle search query
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
    
    setFilters(newFilters);
  }, [searchParams, category]);

  // Get page title based on filters
  const getPageTitle = () => {
    const categoryParam = searchParams.get('category');
    const wholesaleParam = searchParams.get('wholesale');
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      return `Search Results for "${searchParam}"`;
    } else if (wholesaleParam === 'true') {
      return 'Wholesale Products';
    } else if (categoryParam) {
      const categories = categoryParam.split(',');
      if (categories.includes('prescription-medicines') || categories.includes('over-the-counter')) {
        return 'Medicines';
      } else if (categories.includes('cosmetics-personal-care')) {
        return 'Cosmetics & Personal Care';
      } else if (categories.includes('medical-equipment') || categories.includes('first-aid-wellness')) {
        return 'Medical Equipment & Wellness';
      }
    } else if (category) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }
    
    return 'Products Catalog';
  };

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
    // ProductCard component already handles addItem, so we don't need to call it here
    console.log('Product added to cart:', product);
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
      priceRange: [0, 100000] as [number, number],
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
            {getPageTitle()}
          </h1>
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            suggestions={['Panadol Extra', 'Blood pressure monitor', 'Vitamin C tablets']}
          />
        </div>

        {/* Filters Sheet */}
        <div className="mb-6">
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
        <div className="w-full">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;