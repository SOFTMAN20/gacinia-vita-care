import { useState, useMemo } from 'react';
import { 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  Minus,
  RefreshCw,
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  BarChart3,
  History,
  Edit,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useInventoryData } from '@/hooks/useInventoryData';
import { RestockDialog } from '@/components/admin/RestockDialog';
import { StockAdjustmentDialog } from '@/components/admin/StockAdjustmentDialog';
import { StockMovementHistory } from '@/components/admin/StockMovementHistory';
import { BatchExpiryTracker } from '@/components/admin/BatchExpiryTracker';

type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type CategoryFilter = 'all' | string;

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const {
    products,
    categories,
    stockMetrics,
    lowStockProducts,
    expiringProducts,
    recentMovements,
    loading,
    refetch
  } = useInventoryData();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'in-stock' && product.stock_count > product.min_stock_level) ||
        (stockFilter === 'low-stock' && product.stock_count > 0 && product.stock_count <= product.min_stock_level) ||
        (stockFilter === 'out-of-stock' && product.stock_count === 0);
      
      const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
      
      return matchesSearch && matchesStock && matchesCategory;
    });
  }, [products, searchTerm, stockFilter, categoryFilter]);

  const handleRestock = (product: any) => {
    setSelectedProduct(product);
    setRestockDialogOpen(true);
  };

  const handleAdjustment = (product: any) => {
    setSelectedProduct(product);
    setAdjustmentDialogOpen(true);
  };

  const handleViewHistory = (product: any) => {
    setSelectedProduct(product);
    setHistoryDialogOpen(true);
  };

  const handleExportInventory = () => {
    const csvHeaders = [
      'SKU',
      'Product Name',
      'Category',
      'Stock Count',
      'Min Stock Level',
      'Unit Price (TSh)',
      'Total Value (TSh)',
      'Status',
      'Last Updated'
    ];

    const csvData = filteredProducts.map(product => [
      product.sku || '',
      product.name,
      product.category?.name || 'Uncategorized',
      product.stock_count,
      product.min_stock_level,
      product.price,
      product.price * product.stock_count,
      product.stock_count === 0 ? 'Out of Stock' :
        product.stock_count <= product.min_stock_level ? 'Low Stock' : 'In Stock',
      new Date(product.updated_at).toLocaleDateString()
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStockStatus = (product: any) => {
    if (product.stock_count === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const, icon: XCircle };
    }
    if (product.stock_count <= product.min_stock_level) {
      return { label: 'Low Stock', variant: 'secondary' as const, icon: AlertTriangle };
    }
    return { label: 'In Stock', variant: 'default' as const, icon: CheckCircle };
  };

  const getStockPercentage = (product: any) => {
    const optimalStock = product.min_stock_level * 3; // 3x minimum is considered optimal
    return Math.min((product.stock_count / optimalStock) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Inventory Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage your pharmacy stock levels
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportInventory} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              TSh {stockMetrics.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stockMetrics.totalProducts} products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Stock Items
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMetrics.inStock}</div>
            <p className="text-xs text-success mt-1">
              {((stockMetrics.inStock / stockMetrics.totalProducts) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMetrics.lowStock}</div>
            <p className="text-xs text-warning mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMetrics.outOfStock}</div>
            <p className="text-xs text-destructive mt-1">
              Needs restocking
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="expiry">Expiry</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <CardTitle>Stock Overview</CardTitle>
                <div className="flex flex-col space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by product name or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as StockFilter)}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Stock Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stock</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => {
                        const status = getStockStatus(product);
                        const StatusIcon = status.icon;
                        const stockPercentage = getStockPercentage(product);
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {product.image_url ? (
                                  <img 
                                    src={product.image_url} 
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Min: {product.min_stock_level}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {product.sku || '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {product.category?.name || 'Uncategorized'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{product.stock_count}</span>
                                  <span className="text-xs text-muted-foreground">units</span>
                                </div>
                                <Progress value={stockPercentage} className="h-1" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              TSh {(product.price * product.stock_count).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewHistory(product)}
                                  title="View History"
                                >
                                  <History className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAdjustment(product)}
                                  title="Adjust Stock"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRestock(product)}
                                  className="text-success"
                                  title="Restock"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Low Stock Alerts
                  <Badge variant="secondary">{lowStockProducts.length}</Badge>
                </CardTitle>
                <CardDescription>Products below minimum stock level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                      <p className="text-success font-medium">All products well stocked!</p>
                    </div>
                  ) : (
                    lowStockProducts.slice(0, 10).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Stock: {product.stock_count} / Min: {product.min_stock_level}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleRestock(product)}
                          className="bg-success hover:bg-success/90"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Restock
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Out of Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Out of Stock
                  <Badge variant="destructive">{stockMetrics.outOfStock}</Badge>
                </CardTitle>
                <CardDescription>Products requiring immediate restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.filter(p => p.stock_count === 0).length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                      <p className="text-success font-medium">No out of stock items!</p>
                    </div>
                  ) : (
                    products.filter(p => p.stock_count === 0).slice(0, 10).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5">
                        <div className="flex items-center gap-3">
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-destructive">
                              Out of stock - Min required: {product.min_stock_level}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRestock(product)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Restock
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Stock Movements
              </CardTitle>
              <CardDescription>Track all inventory changes and adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMovements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent stock movements
                  </div>
                ) : (
                  recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          movement.type === 'in' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          {movement.type === 'in' ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{movement.product?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {movement.reason} • {new Date(movement.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          movement.type === 'in' ? 'text-success' : 'text-destructive'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {movement.reference || 'System'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiry Tab */}
        <TabsContent value="expiry" className="space-y-4">
          <BatchExpiryTracker products={expiringProducts} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <RestockDialog
        product={selectedProduct}
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        onSuccess={refetch}
      />

      <StockAdjustmentDialog
        product={selectedProduct}
        open={adjustmentDialogOpen}
        onOpenChange={setAdjustmentDialogOpen}
        onSuccess={refetch}
      />

      <StockMovementHistory
        product={selectedProduct}
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />
    </div>
  );
}
