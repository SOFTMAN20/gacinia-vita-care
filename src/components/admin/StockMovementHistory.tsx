import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, RefreshCw, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StockMovementHistoryProps {
  product: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Movement {
  id: string;
  type: string;
  quantity: number;
  reason: string;
  reference: string | null;
  user_id: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

export function StockMovementHistory({ 
  product, 
  open, 
  onOpenChange 
}: StockMovementHistoryProps) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      fetchMovements();
    }
  }, [open, product]);

  const fetchMovements = async () => {
    if (!product) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false})
        .limit(50);

      if (error) throw error;
      
      // Fetch user names separately if needed
      const movementsWithUsers = await Promise.all(
        (data || []).map(async (movement) => {
          if (movement.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', movement.user_id)
              .single();
            
            return { ...movement, profiles: profile };
          }
          return { ...movement, profiles: null };
        })
      );
      
      setMovements(movementsWithUsers);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stock Movement History</DialogTitle>
          <DialogDescription>
            Complete history of stock changes for {product.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stock movements recorded yet
            </div>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div 
                  key={movement.id} 
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg mt-1 ${
                    movement.type === 'in' 
                      ? 'bg-success/10' 
                      : 'bg-destructive/10'
                  }`}>
                    {movement.type === 'in' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          movement.type === 'in' ? 'default' : 'destructive'
                        }>
                          {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                        </Badge>
                        <span className={`font-semibold ${
                          movement.type === 'in' 
                            ? 'text-success' 
                            : 'text-destructive'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(movement.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-foreground">{movement.reason}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {movement.reference && (
                        <>
                          <span>{movement.reference}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>
                        By: {movement.profiles?.full_name || 'System'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
