import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, Package, Archive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BatchExpiryTrackerProps {
  products: any[];
}

export function BatchExpiryTracker({ products }: BatchExpiryTrackerProps) {
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { label: 'Expired', variant: 'destructive' as const, days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 30) {
      return { label: 'Critical', variant: 'destructive' as const, days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 90) {
      return { label: 'Warning', variant: 'warning' as const, days: daysUntilExpiry };
    } else {
      return { label: 'Good', variant: 'default' as const, days: daysUntilExpiry };
    }
  };

  const expiredProducts = products.filter(p => {
    if (!p.expiry_date) return false;
    const status = getExpiryStatus(p.expiry_date);
    return status.days < 0;
  });

  const criticalProducts = products.filter(p => {
    if (!p.expiry_date) return false;
    const status = getExpiryStatus(p.expiry_date);
    return status.days >= 0 && status.days <= 30;
  });

  const warningProducts = products.filter(p => {
    if (!p.expiry_date) return false;
    const status = getExpiryStatus(p.expiry_date);
    return status.days > 30 && status.days <= 90;
  });

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Expired Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {expiredProducts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate action
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Critical (≤30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {criticalProducts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Expiring within 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Warning (31-90 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {warningProducts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Monitor closely
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expired Products */}
      {expiredProducts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Expired Products - Immediate Action Required
            </CardTitle>
            <CardDescription>
              These products have passed their expiry date and should be removed from inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredProducts.map((product) => {
                const status = getExpiryStatus(product.expiry_date);
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-destructive rounded-lg bg-destructive/5">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Batch: {product.batch_number || 'N/A'}
                          </span>
                          <span>•</span>
                          <span className="text-destructive font-medium">
                            Expired {Math.abs(status.days)} days ago
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Expiry: {new Date(product.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Archive className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Products */}
      {criticalProducts.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Critical - Expiring Within 30 Days
            </CardTitle>
            <CardDescription>
              Plan promotions or returns for these products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalProducts.map((product) => {
                const status = getExpiryStatus(product.expiry_date);
                const daysPercentage = (status.days / 30) * 100;
                
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {product.image_url && (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Batch: {product.batch_number || 'N/A'}</span>
                          <span>•</span>
                          <span>Stock: {product.stock_count}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={daysPercentage} className="h-1 flex-1" />
                          <span className="text-xs font-medium text-warning">
                            {status.days} days left
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {new Date(product.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Products */}
      {warningProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Warning - Expiring in 31-90 Days
            </CardTitle>
            <CardDescription>
              Monitor these products and plan inventory accordingly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warningProducts.map((product) => {
                const status = getExpiryStatus(product.expiry_date);
                const daysPercentage = ((90 - status.days) / 90) * 100;
                
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {product.image_url && (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Batch: {product.batch_number || 'N/A'}</span>
                          <span>•</span>
                          <span>Stock: {product.stock_count}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={daysPercentage} className="h-1 flex-1" />
                          <span className="text-xs font-medium">
                            {status.days} days left
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {new Date(product.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Expiring Products */}
      {expiredProducts.length === 0 && criticalProducts.length === 0 && warningProducts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 text-success mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-success mb-1">
                All Products Fresh!
              </h3>
              <p className="text-muted-foreground">
                No products expiring in the next 90 days
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
