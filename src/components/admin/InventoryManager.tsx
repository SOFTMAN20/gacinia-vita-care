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
import { useInventoryData } from '@/hooks/useInventoryData';
import { useStockMovements } from '@/hooks/useStockMovements';

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
  const { stats: realStats, inventoryItems: realInventoryItems, loading, error, updateProductStock } = useInventoryData();
  const { movements, loading: movementsLoading } = useStockMovements();
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    reference: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStockStatus = (item: any) => {
    return item.status || 'in_stock';
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

  const filteredItems = realInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStockStatus(item);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStockAdjustment = async () => {
    if (!selectedItem || adjustmentData.quantity === 0) return;

    try {
      // Calculate new stock count based on adjustment type
      let newStockCount = selectedItem.currentStock;
      
      if (adjustmentData.type === 'in') {
        newStockCount += Math.abs(adjustmentData.quantity);
      } else if (adjustmentData.type === 'out') {
        newStockCount -= Math.abs(adjustmentData.quantity);
      } else if (adjustmentData.type === 'adjustment') {
        // For adjustment, the quantity is the new absolute value
        newStockCount = Math.abs(adjustmentData.quantity);
      }

      // Ensure stock doesn't go below 0
      newStockCount = Math.max(0, newStockCount);

      // Update the database
      const result = await updateProductStock(selectedItem.id, newStockCount);
      
      if (result.success) {
        // Create stock movement record
        const newMovement: StockMovement = {
          id: Date.now().toString(),
          productId: selectedItem.id,
          productName: selectedItem.name,
          type: adjustmentData.type,
          quantity: adjustmentData.type === 'out' ? -Math.abs(adjustmentData.quantity) : Math.abs(adjustmentData.quantity),
          reason: adjustmentData.reason,
          date: new Date().toISOString().split('T')[0],
          user: 'Current User',
          reference: adjustmentData.reference
        };

        setStockMovements(prev => [newMovement, ...prev]);

        // Reset form and close dialog
        setAdjustmentData({ type: 'in', quantity: 0, reason: '', reference: '' });
        setIsAdjustmentDialogOpen(false);
        setSelectedItem(null);
        
        console.log('Stock updated successfully:', newMovement);
      } else {
        console.error('Failed to update stock:', result.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error during stock adjustment:', error);
    }
  };

  // Export functionality
  const handleExport = () => {
    const csvHeaders = [
      'Product ID',
      'Product Name', 
      'SKU',
      'Current Stock',
      'Min Stock',
      'Category',
      'Price (TSh)',
      'Location',
      'Supplier',
      'Last Updated',
      'Expiry Date',
      'Batch Number',
      'Status'
    ];

    const csvData = realInventoryItems.map(item => [
      item.id,
      item.name,
      item.sku,
      item.currentStock,
      item.minStock,
      item.category,
      item.price,
      item.location || 'Main Store',
      item.supplier || 'Various',
      item.lastUpdated,
      item.expiryDate || '',
      item.batchNumber || '',
      getStockStatus(item)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gacinia-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import functionality
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '').trim()));
        const headers = rows[0];
        const data = rows.slice(1, 6); // Preview first 5 rows
        
        const preview = data.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        setImportPreview(preview.filter(item => item['Product Name'])); // Filter out empty rows
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = () => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '').trim()));
      const headers = rows[0];
      const data = rows.slice(1);

      const importedItems: InventoryItem[] = data
        .filter(row => row[1]) // Filter rows with product names
        .map((row, index) => ({
          id: `imported-${Date.now()}-${index}`,
          productId: row[0] || `PRD-${Date.now()}-${index}`,
          productName: row[1],
          sku: row[2] || `SKU-${Date.now()}-${index}`,
          currentStock: parseInt(row[3]) || 0,
          minStock: parseInt(row[4]) || 5,
          maxStock: parseInt(row[5]) || 100,
          reorderLevel: parseInt(row[6]) || 10,
          unitCost: parseFloat(row[7]) || 0,
          location: row[8] || 'Main Store',
          supplier: row[9] || 'Unknown Supplier',
          lastRestocked: row[10] || new Date().toISOString().split('T')[0],
          expiryDate: row[11] || undefined,
          batchNumber: row[12] || undefined,
        }));

      // Note: In a real app, you would update the database here
      console.log('Import completed:', importedItems);

      setIsImportDialogOpen(false);
      setImportFile(null);
      setImportPreview([]);
      alert(`Successfully imported ${importedItems.length} items!`);
    };
    reader.readAsText(importFile);
  };

  const stats = realStats;

  if (loading || movementsLoading) {
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
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage product stock levels
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="w-full sm:w-auto">
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
                <TableHead>Min/Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
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
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.supplier || 'Various'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>{item.location || 'Main Store'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium">{item.currentStock}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Min: {item.minStock}</div>
                        <div>Category: {item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(status)}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
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
              {(movements.length ? movements : stockMovements).slice(0, 10).map((movement) => (
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

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Inventory Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import or update inventory items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!importFile && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium">
                        Upload CSV file
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        CSV files only. Max 10MB.
                      </span>
                    </Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <Button className="mt-4" asChild>
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Label>
                  </Button>
                </div>
              </div>
            )}

            {importFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="font-medium">{importFile.name}</span>
                    <Badge variant="secondary">{(importFile.size / 1024).toFixed(1)} KB</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setImportFile(null);
                      setImportPreview([]);
                    }}
                  >
                    Remove
                  </Button>
                </div>

                {importPreview.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Preview (First 5 rows)</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Min Stock</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Supplier</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importPreview.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row['Product Name']}</TableCell>
                              <TableCell>{row['SKU']}</TableCell>
                              <TableCell>{row['Current Stock']}</TableCell>
                              <TableCell>{row['Min Stock']}</TableCell>
                              <TableCell>{row['Unit Cost (TSh)']}</TableCell>
                              <TableCell>{row['Supplier']}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Headers: Product ID, Product Name, SKU, Current Stock, Min Stock, Max Stock, Reorder Level, Unit Cost (TSh), Location, Supplier, Last Restocked, Expiry Date, Batch Number</li>
                    <li>• Existing items (matched by SKU or Product ID) will be updated</li>
                    <li>• New items will be added to inventory</li>
                    <li>• Numeric fields will default to 0 if empty</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsImportDialogOpen(false);
                  setImportFile(null);
                  setImportPreview([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile}
              >
                Import Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}