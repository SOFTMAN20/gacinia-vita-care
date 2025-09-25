import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus } from 'lucide-react';
import { useRestockProduct } from '@/hooks/useRestockProduct';
import type { LowStockProduct } from '@/hooks/useLowStockAlerts';

interface RestockDialogProps {
  product: LowStockProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RestockDialog = ({ product, open, onOpenChange, onSuccess }: RestockDialogProps) => {
  const [newStock, setNewStock] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const { restockProduct, loading } = useRestockProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    const stockValue = parseInt(newStock) || 0;
    if (stockValue < 0) {
      return;
    }

    try {
      await restockProduct(product.id, stockValue);
      onSuccess();
      onOpenChange(false);
      setNewStock('');
      setAddAmount('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddStock = () => {
    const currentStock = product?.stock_count || 0;
    const addValue = parseInt(addAmount) || 0;
    const newTotal = currentStock + addValue;
    setNewStock(newTotal.toString());
  };

  const handleClose = () => {
    onOpenChange(false);
    setNewStock('');
    setAddAmount('');
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Restock Product
          </DialogTitle>
          <DialogDescription>
            Update the stock quantity for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Product Info */}
            <div className="grid grid-cols-4 items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="col-span-4">
                <div className="flex items-center space-x-3">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted-foreground/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current Stock: {product.stock_count} | Min: {product.min_stock_level}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Section */}
            <div className="grid gap-2">
              <Label htmlFor="add-amount">Quick Add Stock</Label>
              <div className="flex gap-2">
                <Input
                  id="add-amount"
                  type="number"
                  placeholder="Amount to add"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  min="1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddStock}
                  disabled={!addAmount || parseInt(addAmount) <= 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* New Stock Total */}
            <div className="grid gap-2">
              <Label htmlFor="new-stock">New Stock Total</Label>
              <Input
                id="new-stock"
                type="number"
                placeholder="Enter new stock quantity"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !newStock || parseInt(newStock) < 0}
            >
              {loading ? 'Updating...' : 'Update Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};