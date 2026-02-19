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
import { ProductQuickView } from '@/components/product/ProductQuickView';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';

const Products = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { addItem, state } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 10000000] as [number, number],
    availability: [],
    special: []
  });

  // Memoize filters to avoid refetch loops
  // Only apply price filters when user has actively changed them from defaults
  const stableFilters = useMemo(() => ({
    category: filters.categories.length > 0 ? filters.categories[0] : undefined,
    search: searchQuery || undefined,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice: filters.priceRange[1] < 10000000 ? filters.priceRange[1] : undefined,
  }), [filters.categories, filters.priceRange, searchQuery]);

  const { products, loading, error } = useProducts(stableFilters);

  const { categories } = useCategories();

  // Handle URL parameters for category filtering and search
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const wholesaleParam = searchParams.get('wholesale');
    const searchParam = searchParams.get('search');

    const newFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 10000000] as [number, number],
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
      const category = categories.find(cat => cat.slug === categoryParam);
      return category ? category.name : 'Products';
    }

    return 'Products Catalog';
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Apply availability filter
    if (filters.availability.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (filters.availability.includes('in-stock') && product.in_stock && (product.stock_count || 0) > 5) return true;
        if (filters.availability.includes('low-stock') && product.in_stock && (product.stock_count || 0) <= 5) return true;
        if (filters.availability.includes('out-of-stock') && !product.in_stock) return true;
        return false;
      });
    }

    // Apply special filters
    if (filters.special.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (filters.special.includes('prescription') && product.requires_prescription) return true;
        if (filters.special.includes('wholesale') && product.wholesale_available) return true;
        if (filters.special.includes('on-sale') && product.original_price) return true;
        return false;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      case 'best-selling':
      case 'relevance':
      default:
        // Keep original order for now
        break;
    }

    return filteredProducts;
  }, [products, filters, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const handleToggleWishlist = (product: Product) => {
    console.log('Toggle wishlist:', product);
    // TODO: Implement wishlist functionality
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 10000000] as [number, number],
      availability: [],
      special: []
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={state.totalItems} />

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            suggestions={['Panadol Extra', 'Blood pressure monitor', 'Vitamin C tablets']}
          />
        </div>

        {/* Products Content */}
        <div className="w-full">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {/* Toolbar - Filters and Sort in one line */}
          {!error && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
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

              <div className="w-full sm:w-auto">
                <ProductSort
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <ProductGrid
              products={filteredAndSortedProducts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};

export default Products;
