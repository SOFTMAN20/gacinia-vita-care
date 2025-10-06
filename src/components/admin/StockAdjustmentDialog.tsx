import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StockAdjustmentDialogProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type AdjustmentType = 'add' | 'remove' | 'set';

export function StockAdjustmentDialog({ 
  product, 
  open, 
  onOpenChange,
  onSuccess 
}: StockAdjustmentDialogProps) {
  const { profile } = useAuth();
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !quantity || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      let newStockCount = product.stock_count || 0;
      let movementType: 'in' | 'out' | 'adjustment' = 'adjustment';
      let actualQuantity = quantityNum;

      if (adjustmentType === 'add') {
        newStockCount += quantityNum;
        movementType = 'in';
      } else if (adjustmentType === 'remove') {
        newStockCount = Math.max(0, newStockCount - quantityNum);
        movementType = 'out';
        actualQuantity = -quantityNum;
      } else if (adjustmentType === 'set') {
        actualQuantity = quantityNum - newStockCount;
        newStockCount = quantityNum;
        movementType = actualQuantity >= 0 ? 'in' : 'out';
      }

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          stock_count: newStockCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Record stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: product.id,
          type: movementType,
          quantity: Math.abs(actualQuantity),
          reason: reason,
          user_id: profile?.id || null,
          reference: `Manual adjustment: ${adjustmentType}`,
        });

      if (movementError) throw movementError;

      toast.success('Stock adjusted successfully');
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setQuantity('');
      setReason('');
      setAdjustmentType('add');
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast.error('Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Make manual adjustments to stock levels for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Stock</Label>
            <div className="text-2xl font-bold">{product.stock_count || 0} units</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-type">Adjustment Type</Label>
            <Select value={adjustmentType} onValueChange={(value) => setAdjustmentType(value as AdjustmentType)}>
              <SelectTrigger id="adjustment-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-success" />
                    Add Stock
                  </div>
                </SelectItem>
                <SelectItem value="remove">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-destructive" />
                    Remove Stock
                  </div>
                </SelectItem>
                <SelectItem value="set">Set Exact Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {adjustmentType === 'set' ? 'New Stock Level' : 'Quantity'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={adjustmentType === 'set' ? 'Enter new stock level' : 'Enter quantity'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Damaged items, Inventory count correction, etc."
              required
              rows={3}
            />
          </div>

          {quantity && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <p className="text-sm text-muted-foreground">
                Current: {product.stock_count || 0} units →{' '}
                <span className="font-semibold text-foreground">
                  New: {
                    adjustmentType === 'add' 
                      ? (product.stock_count || 0) + parseInt(quantity || '0')
                      : adjustmentType === 'remove'
                      ? Math.max(0, (product.stock_count || 0) - parseInt(quantity || '0'))
                      : parseInt(quantity || '0')
                  } units
                </span>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adjust Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
