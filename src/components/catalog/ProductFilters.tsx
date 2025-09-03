import { useState } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { categories, brands } from '@/data/products';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  availability: string[];
  special: string[];
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  isMobile = false 
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    availability: true,
    special: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'brands' | 'availability' | 'special', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const appliedFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    filters.availability.length + 
    filters.special.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? 1 : 0);

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof openSections; 
    children: React.ReactNode;
  }) => (
    <Collapsible 
      open={openSections[section]} 
      onOpenChange={() => toggleSection(section)}
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between font-medium text-left p-0 h-auto"
        >
          {title}
          <ChevronDown className={`h-4 w-4 transition-transform ${openSections[section] ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Card className={`${isMobile ? 'w-full' : 'w-80'} h-fit sticky top-4`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
            {appliedFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {appliedFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {appliedFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <FilterSection title="Categories" section="categories">
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categories.includes(category.slug)}
                  onCheckedChange={() => toggleArrayFilter('categories', category.slug)}
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer flex-1 flex justify-between"
                >
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">({category.count})</span>
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>TZS {filters.priceRange[0].toLocaleString()}</span>
              <span>TZS {filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands" section="brands">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleArrayFilter('brands', brand)}
                />
                <label 
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" section="availability">
          <div className="space-y-2">
            {['in-stock', 'out-of-stock', 'low-stock'].map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${option}`}
                  checked={filters.availability.includes(option)}
                  onCheckedChange={() => toggleArrayFilter('availability', option)}
                />
                <label 
                  htmlFor={`availability-${option}`}
                  className="text-sm cursor-pointer capitalize"
                >
                  {option.replace('-', ' ')}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Special Filters */}
        <FilterSection title="Special" section="special">
          <div className="space-y-2">
            {[
              { value: 'prescription', label: 'Prescription Required' },
              { value: 'wholesale', label: 'Wholesale Available' },
              { value: 'on-sale', label: 'On Sale' }
            ].map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`special-${option.value}`}
                  checked={filters.special.includes(option.value)}
                  onCheckedChange={() => toggleArrayFilter('special', option.value)}
                />
                <label 
                  htmlFor={`special-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
}