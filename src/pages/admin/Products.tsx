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

// Mock product data
const mockProducts = [
  {
    id: 'PRD-001',
    name: 'Panadol Extra',
    sku: 'PND-EXT-500',
    category: 'Pain Relief',
    price: 2500,
    stock: 150,
    minStock: 20,
    status: 'active',
    lastUpdated: '2024-01-10'
  },
  {
    id: 'PRD-002',
    name: 'Amoxicillin 500mg',
    sku: 'AMX-500-CAP',
    category: 'Antibiotics',
    price: 800,
    stock: 8,
    minStock: 50,
    status: 'active',
    lastUpdated: '2024-01-09'
  },
  {
    id: 'PRD-003',
    name: 'Blood Pressure Monitor',
    sku: 'BPM-DIG-001',
    category: 'Medical Equipment',
    price: 85000,
    stock: 12,
    minStock: 5,
    status: 'active',
    lastUpdated: '2024-01-08'
  },
  {
    id: 'PRD-004',
    name: 'Vitamin C 1000mg',
    sku: 'VIT-C-1000',
    category: 'Supplements',
    price: 1500,
    stock: 0,
    minStock: 30,
    status: 'out_of_stock',
    lastUpdated: '2024-01-07'
  },
  {
    id: 'PRD-005',
    name: 'Face Moisturizer SPF 30',
    sku: 'COS-MOIST-SPF30',
    category: 'Cosmetics',
    price: 12000,
    stock: 45,
    minStock: 10,
    status: 'active',
    lastUpdated: '2024-01-06'
  }
];

const getStatusBadge = (status: string, stock: number, minStock: number) => {
  if (status === 'out_of_stock' || stock === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (stock <= minStock) {
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

  const categories = ['all', 'Pain Relief', 'Antibiotics', 'Medical Equipment', 'Supplements', 'Cosmetics'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductSubmit = (data: any) => {
    console.log('Product submitted:', data);
    setShowProductForm(false);
    setEditingProduct(null);
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
      />
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
            <div className="text-2xl font-bold">{mockProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProducts.filter(p => p.status === 'active' && p.stock > 0).length}
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
              {mockProducts.filter(p => p.stock > 0 && p.stock <= p.minStock).length}
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
              {mockProducts.filter(p => p.stock === 0).length}
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
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
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
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>TSh {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStockIndicator(product.stock, product.minStock)}
                      <span>{product.stock}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status, product.stock, product.minStock)}
                  </TableCell>
                  <TableCell>{product.lastUpdated}</TableCell>
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
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
    </div>
  );
}