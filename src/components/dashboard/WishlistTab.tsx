import { useWishlist, useRemoveFromWishlist } from '@/hooks/useUserDashboard';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Package,
  AlertCircle,
  Loader2,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WishlistTab = () => {
  const { data: wishlist = [], isLoading } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const { addItem } = useCart();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlistMutation.mutateAsync(productId);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      await addItem(product, 1);
    } catch (error) {
      // Error handling is done in the cart context
    }
  };

  const handleAddAllToCart = async () => {
    try {
      for (const item of wishlist) {
        if (item.product.in_stock) {
          await addItem(item.product as any, 1);
        }
      }
    } catch (error) {
      // Error handling is done in the cart context
    }
  };

  const inStockItems = wishlist.filter(item => item.product.in_stock);
  const outOfStockItems = wishlist.filter(item => !item.product.in_stock);
  const itemsWithDiscount = wishlist.filter(item => 
    item.product.original_price && item.product.original_price > item.product.price
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">My Wishlist</h3>
          <p className="text-sm text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        {wishlist.length > 0 && inStockItems.length > 0 && (
          <Button onClick={handleAddAllToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add All to Cart ({inStockItems.length})
          </Button>
        )}
      </div>

      {/* Price Drop Alerts */}
      {itemsWithDiscount.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Price Drop Alert!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-3">
              {itemsWithDiscount.length} {itemsWithDiscount.length === 1 ? 'item' : 'items'} in your wishlist now have lower prices!
            </p>
            <div className="space-y-2">
              {itemsWithDiscount.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">
                        TZS {item.product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        TZS {item.product.original_price?.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(((item.product.original_price! - item.product.price) / item.product.original_price!) * 100)}% OFF
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAddToCart(item.product)}>
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save items you love to buy them later
              </p>
              <Button asChild>
                <Link to="/products">
                  <Package className="w-4 h-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <Card key={item.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Image */}
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-primary">
                            TZS {item.product.price.toLocaleString()}
                          </span>
                          {item.product.original_price && item.product.original_price > item.product.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              TZS {item.product.original_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.product.in_stock ? (
                            <Badge variant="secondary" className="text-xs">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                          
                          {item.product.original_price && item.product.original_price > item.product.price && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item.product)}
                      disabled={!item.product.in_stock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove "{item.product.name}" from your wishlist?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveFromWishlist(item.product_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Out of Stock Notice */}
      {outOfStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Out of Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-3">
              {outOfStockItems.length} {outOfStockItems.length === 1 ? 'item' : 'items'} in your wishlist are currently out of stock. We'll notify you when they're available again.
            </p>
            <div className="space-y-2">
              {outOfStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      TZS {item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};