import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  Package,
  AlertTriangle,
  Settings,
  Archive,
  FolderTree
} from 'lucide-react';
import { useAdminProducts, CreateProductData } from '@/hooks/useAdminProducts';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductForm from '@/components/admin/ProductForm';
import CategoriesManager from '@/components/admin/CategoriesManager';
import InventoryManager from '@/components/admin/InventoryManager';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const getStatusBadge = (product: any) => {
  if (!product.in_stock || product.stock_count === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (product.stock_count <= product.min_stock_level) {
    return <Badge variant="secondary">Low Stock</Badge>;
  }
  return <Badge variant="default">In Stock</Badge>;
};

const getStockIndicator = (stock: number, minStock: number) => {
  if (stock === 0) {
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  }
  if (stock <= minStock) {
    return <AlertTriangle className="w-4 h-4 text-warning" />;
  }
  return <Package className="w-4 h-4 text-success" />;
};

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useAdminProducts();
  const { categories } = useCategories();

  const categoryOptions = ['all', ...categories.map(cat => cat.name)];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateUniqueSKU = (baseName: string): string => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const namePrefix = baseName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
    return `${namePrefix}-${timestamp}-${randomSuffix}`;
  };

  const handleProductSubmit = async (data: any) => {
    try {
      // Generate unique SKU if not provided or if it's empty
      const finalSKU = data.sku && data.sku.trim() ? data.sku.trim() : generateUniqueSKU(data.name);
      
      const productData: CreateProductData = {
        name: data.name,
        description: data.description,
        short_description: data.shortDescription,
        category_id: data.category,
        brand: data.brand,
        sku: finalSKU,
        price: Number(data.retailPrice),
        original_price: data.originalPrice ? Number(data.originalPrice) : undefined,
        wholesale_price: Number(data.wholesalePrice),
        image_url: data.images?.[0],
        images: data.images || [],
        stock_count: Number(data.stock),
        min_stock_level: Number(data.minStock) || 5,
        requires_prescription: Boolean(data.requiresPrescription),
        wholesale_available: Boolean(data.wholesaleAvailable),
        key_features: data.tags || [],
        weight: data.weight ? data.weight.toString() : null,
        is_active: data.status === 'active',
        featured: Boolean(data.featured),
        in_stock: Number(data.stock) > 0, // Set in_stock based on stock count
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated and customers can now see the changes!');
      } else {
        await createProduct(productData);
        toast.success('Product created and is now available for customers!');
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Product submission error:', error);
      if (error?.message?.includes('duplicate key value violates unique constraint "products_sku_key"')) {
        toast.error('This SKU already exists. Please use a different SKU.');
      } else {
        toast.error('Failed to save product. Please try again.');
      }
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on products:`, selectedProducts);
    setSelectedProducts([]);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length 
        ? [] 
        : filteredProducts.map(p => p.id)
    );
  };

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={handleProductSubmit}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        isLoading={loading}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground">
            Manage your pharmacy inventory and product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowProductForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          {selectedProducts.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedProducts.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                  <Package className="w-4 h-4 mr-2" />
                  Activate Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                  <Archive className="w-4 h-4 mr-2" />
                  Deactivate Selected
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('delete')}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.is_active && p.stock_count > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock_count > 0 && p.stock_count <= p.min_stock_level).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock_count === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categoryOptions.map((category) => (
                    <DropdownMenuItem
                      key={typeof category === 'string' ? category : category}
                      onClick={() => setSelectedCategory(typeof category === 'string' ? category : category)}
                    >
                      {typeof category === 'string' ? (category === 'all' ? 'All Categories' : category) : category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={selectAllProducts}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku || '-'}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>TSh {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStockIndicator(product.stock_count, product.min_stock_level)}
                      <span>{product.stock_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product)}
                  </TableCell>
                  <TableCell>{new Date(product.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const formData = {
                            name: product.name,
                            nameSwahili: '',
                            description: product.description || '',
                            shortDescription: product.short_description || '',
                            category: product.category_id,
                            brand: product.brand || '',
                            sku: product.sku || '',
                            retailPrice: product.price,
                            originalPrice: product.original_price || 0,
                            wholesalePrice: product.wholesale_price || 0,
                            stock: product.stock_count,
                            minStock: product.min_stock_level,
                            weight: product.weight ? parseFloat(product.weight) : 0,
                            requiresPrescription: product.requires_prescription,
                            wholesaleAvailable: product.wholesale_available,
                            featured: product.featured,
                            status: product.is_active ? 'active' : 'inactive',
                            seoTitle: '',
                            seoDescription: '',
                            tags: product.key_features || [],
                            images: product.images || []
                          };
                          setEditingProduct({ ...product, ...formData });
                          setShowProductForm(true);
                        }}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this product?')) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesManager />
      </TabsContent>

      <TabsContent value="inventory">
        <InventoryManager />
      </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}