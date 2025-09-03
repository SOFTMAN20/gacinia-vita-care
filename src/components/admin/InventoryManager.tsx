import { useState } from 'react';
import { 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  RotateCcw,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  lastRestocked: string;
  supplier: string;
  unitCost: number;
  location: string;
  expiryDate?: string;
  batchNumber?: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  user: string;
  reference?: string;
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    productId: 'PRD-001',
    productName: 'Panadol Extra',
    sku: 'PND-EXT-500',
    currentStock: 150,
    minStock: 20,
    maxStock: 500,
    reorderLevel: 50,
    lastRestocked: '2024-01-10',
    supplier: 'GSK Tanzania',
    unitCost: 1800,
    location: 'A1-B2',
    expiryDate: '2025-06-15',
    batchNumber: 'PND2024001'
  },
  {
    id: '2',
    productId: 'PRD-002',
    productName: 'Amoxicillin 500mg',
    sku: 'AMX-500-CAP',
    currentStock: 8,
    minStock: 50,
    maxStock: 300,
    reorderLevel: 75,
    lastRestocked: '2024-01-05',
    supplier: 'Pfizer East Africa',
    unitCost: 600,
    location: 'B1-C3',
    expiryDate: '2024-12-20',
    batchNumber: 'AMX2024005'
  },
  {
    id: '3',
    productId: 'PRD-003',
    productName: 'Blood Pressure Monitor',
    sku: 'BPM-DIG-001',
    currentStock: 12,
    minStock: 5,
    maxStock: 50,
    reorderLevel: 10,
    lastRestocked: '2024-01-08',
    supplier: 'Omron Healthcare',
    unitCost: 75000,
    location: 'C1-A1'
  }
];

const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    productId: 'PRD-001',
    productName: 'Panadol Extra',
    type: 'in',
    quantity: 100,
    reason: 'New stock arrival',
    date: '2024-01-10',
    user: 'Admin User',
    reference: 'PO-2024-001'
  },
  {
    id: '2',
    productId: 'PRD-001',
    productName: 'Panadol Extra',
    type: 'out',
    quantity: 5,
    reason: 'Sale to customer',
    date: '2024-01-11',
    user: 'Sales Staff',
    reference: 'ORD-2024-015'
  },
  {
    id: '3',
    productId: 'PRD-002',
    productName: 'Amoxicillin 500mg',
    type: 'adjustment',
    quantity: -2,
    reason: 'Damaged items',
    date: '2024-01-12',
    user: 'Inventory Manager'
  }
];

export default function InventoryManager() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    reference: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return 'out_of_stock';
    if (item.currentStock <= item.minStock) return 'low_stock';
    if (item.currentStock <= item.reorderLevel) return 'reorder';
    return 'in_stock';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'low_stock':
        return <Badge variant="secondary">Low Stock</Badge>;
      case 'reorder':
        return <Badge variant="outline">Reorder Level</Badge>;
      default:
        return <Badge variant="default">In Stock</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'reorder':
        return <Package className="w-4 h-4 text-warning" />;
      default:
        return <Package className="w-4 h-4 text-success" />;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStockAdjustment = () => {
    if (!selectedItem || adjustmentData.quantity === 0) return;

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      productId: selectedItem.productId,
      productName: selectedItem.productName,
      type: adjustmentData.type,
      quantity: adjustmentData.type === 'out' ? -Math.abs(adjustmentData.quantity) : Math.abs(adjustmentData.quantity),
      reason: adjustmentData.reason,
      date: new Date().toISOString().split('T')[0],
      user: 'Current User',
      reference: adjustmentData.reference
    };

    setStockMovements(prev => [newMovement, ...prev]);

    setInventoryItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            currentStock: Math.max(0, item.currentStock + newMovement.quantity),
            lastRestocked: adjustmentData.type === 'in' ? newMovement.date : item.lastRestocked
          }
        : item
    ));

    setIsAdjustmentDialogOpen(false);
    setSelectedItem(null);
    setAdjustmentData({ type: 'in', quantity: 0, reason: '', reference: '' });
  };

  const stats = {
    totalItems: inventoryItems.length,
    lowStock: inventoryItems.filter(item => getStockStatus(item) === 'low_stock').length,
    outOfStock: inventoryItems.filter(item => getStockStatus(item) === 'out_of_stock').length,
    reorderLevel: inventoryItems.filter(item => getStockStatus(item) === 'reorder').length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage product stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.outOfStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Level</CardTitle>
            <RotateCcw className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.reorderLevel}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TSh {stats.totalValue.toLocaleString()}</div>
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="reorder">Reorder Level</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">{item.supplier}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium">{item.currentStock}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Min: {item.minStock}</div>
                        <div>Max: {item.maxStock}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell>{item.lastRestocked}</TableCell>
                    <TableCell>
                      {item.expiryDate && (
                        <div className="text-sm">
                          <div>{item.expiryDate}</div>
                          <div className="text-muted-foreground">{item.batchNumber}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsAdjustmentDialogOpen(true);
                        }}
                      >
                        Adjust Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockMovements.slice(0, 10).map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>{movement.productName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        movement.type === 'in' ? 'default' : 
                        movement.type === 'out' ? 'destructive' : 'secondary'
                      }
                    >
                      {movement.type === 'in' && <Plus className="w-3 h-3 mr-1" />}
                      {movement.type === 'out' && <Minus className="w-3 h-3 mr-1" />}
                      {movement.type === 'adjustment' && <RotateCcw className="w-3 h-3 mr-1" />}
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={movement.quantity > 0 ? 'text-success' : 'text-destructive'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>{movement.user}</TableCell>
                  <TableCell>{movement.reference || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Update stock levels for {selectedItem?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Stock: {selectedItem?.currentStock}</Label>
            </div>
            
            <div>
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select
                value={adjustmentData.type}
                onValueChange={(value: 'in' | 'out' | 'adjustment') => 
                  setAdjustmentData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={adjustmentData.quantity}
                onChange={(e) => setAdjustmentData(prev => ({ 
                  ...prev, 
                  quantity: Number(e.target.value) 
                }))}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData(prev => ({ 
                  ...prev, 
                  reason: e.target.value 
                }))}
                placeholder="Reason for adjustment"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                value={adjustmentData.reference}
                onChange={(e) => setAdjustmentData(prev => ({ 
                  ...prev, 
                  reference: e.target.value 
                }))}
                placeholder="PO number, Order ID, etc."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAdjustmentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStockAdjustment}
                disabled={!adjustmentData.quantity || !adjustmentData.reason}
              >
                Apply Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}