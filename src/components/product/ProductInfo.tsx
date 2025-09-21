import { Star, AlertTriangle, Shield, Clock, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/hooks/useProducts';
import { ShareProduct } from '@/components/ui/share-product';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {product.brand && (
            <Badge variant="outline" className="text-muted-foreground">
              {product.brand}
            </Badge>
          )}
          {product.requires_prescription && (
            <Badge className="bg-warning/10 text-warning border-warning/20">
              <AlertTriangle size={12} className="mr-1" />
              Prescription Required
            </Badge>
          )}
          {product.wholesale_available && (
            <Badge className="bg-accent/10 text-accent border-accent/20">
              Wholesale Available
            </Badge>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex-1 break-words">
            {product.name}
          </h1>
          <ShareProduct 
            product={product}
            variant="outline"
            size="default"
            showText={true}
            className="flex-shrink-0"
          />
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(product.rating!)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.review_count} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              TZS {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  TZS {product.original_price.toLocaleString()}
                </span>
                <Badge className="bg-error text-error-foreground">
                  -{discountPercentage}% OFF
                </Badge>
              </>
            )}
          </div>
          
          {product.wholesale_price && (
            <p className="text-sm text-muted-foreground">
              Wholesale price: TZS {product.wholesale_price.toLocaleString()} (bulk orders)
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.in_stock ? (
            <>
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="text-sm text-success font-medium">In Stock</span>
              {product.stock_count && product.stock_count <= 5 && (
                <span className="text-sm text-warning">
                  (Only {product.stock_count} left)
                </span>
              )}
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <span className="text-sm text-error font-medium">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specs</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          {product.description && (
            <Card className="overflow-hidden w-full">
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Product Description</CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden px-3 sm:px-6">
                <p className="text-muted-foreground leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap text-sm sm:text-base max-w-full">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          )}

          {product.key_features && product.key_features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.key_features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {product.sku && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Weight</span>
                    <span className="text-muted-foreground">{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Dimensions</span>
                    <span className="text-muted-foreground">{product.dimensions}</span>
                  </div>
                )}
                {product.technical_specs && Object.entries(product.technical_specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          {product.usage_instructions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package size={20} />
                  Usage Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.usage_instructions}
                </p>
              </CardContent>
            </Card>
          )}

          {product.dosage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock size={20} />
                  Dosage Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.dosage}
                </p>
              </CardContent>
            </Card>
          )}

          {product.ingredients && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.ingredients}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          {product.storage_requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield size={20} />
                  Storage Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.storage_requirements}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.manufacturer && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Manufacturer</span>
                  <span className="text-muted-foreground">{product.manufacturer}</span>
                </div>
              )}
              {product.batch_number && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Batch Number</span>
                  <span className="text-muted-foreground">{product.batch_number}</span>
                </div>
              )}
              {product.expiry_date && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Expiry Date</span>
                  <span className="text-muted-foreground">{product.expiry_date}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}