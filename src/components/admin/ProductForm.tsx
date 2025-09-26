import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Upload,
  X,
  Save,
  ArrowLeft,
  Plus,
  Trash2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUploader } from '@/components/ui/image-uploader';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  nameSwahili: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  sku: z.string().optional(),
  retailPrice: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  originalPrice: z.coerce.number().optional(),
  wholesalePrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  minStock: z.coerce.number().min(0, 'Minimum stock must be positive'),
  weight: z.coerce.number().optional(),
  requiresPrescription: z.boolean().default(false),
  wholesaleAvailable: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'draft']).default('active'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Partial<ProductFormData & { images?: string[] }>;
  onSubmit: (data: ProductFormData & { images: string[] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import AddBrandDialog from './AddBrandDialog';

export default function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [currentTag, setCurrentTag] = useState('');
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false);
  const { categories } = useCategories();
  const { brands, loading: brandsLoading, refetch: refetchBrands } = useBrands();

  const handleBrandAdded = (brandName: string) => {
    form.setValue('brand', brandName);
    refetchBrands(); // Ensure the brands list is updated
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      nameSwahili: product?.nameSwahili || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      category: product?.category || '',
      brand: product?.brand || '',
      sku: product?.sku || '',
      retailPrice: product?.retailPrice || 0,
      originalPrice: product?.originalPrice || 0,
      wholesalePrice: product?.wholesalePrice || 0,
      stock: product?.stock || 0,
      minStock: product?.minStock || 5,
      weight: product?.weight || 0,
      requiresPrescription: product?.requiresPrescription || false,
      wholesaleAvailable: product?.wholesaleAvailable || false,
      featured: product?.featured || false,
      status: product?.status || 'active',
      seoTitle: product?.seoTitle || '',
      seoDescription: product?.seoDescription || '',
      tags: product?.tags || [],
    },
  });

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const addTag = () => {
    if (currentTag.trim() && !form.getValues('tags').includes(currentTag.trim())) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const onFormSubmit = (data: ProductFormData) => {
    console.log('🔥 ProductForm onFormSubmit called with:', data);
    console.log('🔥 Images:', images);
    console.log('✅ Form validation passed, submitting...');
    onSubmit({ ...data, images });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-muted-foreground">
              {product ? 'Update product information' : 'Create a new product for your catalog'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={(e) => {
              console.log('🔥 Save button clicked!');
              console.log('🔥 Form values:', form.getValues());
              console.log('🔥 Form errors:', form.formState.errors);
              
              // Manually trigger form submission
              form.handleSubmit(onFormSubmit)();
            }}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form 
          id="product-form"
          onSubmit={form.handleSubmit(onFormSubmit)} 
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter product name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nameSwahili"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Kiswahili)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Jina la bidhaa kwa Kiswahili" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Brief product description for listings"
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description shown in product listings (max 500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Detailed product description, usage instructions, ingredients, etc."
                            rows={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description with usage instructions, ingredients, side effects, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    bucket="product-images"
                    maxFiles={10}
                    currentImages={images}
                    onImagesChange={handleImagesChange}
                  />
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SEO optimized title" />
                        </FormControl>
                        <FormDescription>
                          Title that appears in search engines (recommended: 50-60 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="SEO meta description"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Description that appears in search engines (recommended: 150-160 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Visibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Featured Product</FormLabel>
                          <FormDescription>
                            Show in featured products section
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiresPrescription"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Requires Prescription</FormLabel>
                          <FormDescription>
                            Prescription required for purchase
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wholesaleAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Wholesale Available</FormLabel>
                          <FormDescription>
                            Available for wholesale purchase
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category & Brand */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <div className="flex gap-2">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brandsLoading ? (
                                <SelectItem value="loading" disabled>
                                  Loading brands...
                                </SelectItem>
                              ) : brands.length === 0 ? (
                                <SelectItem value="no-brands" disabled>
                                  No brands available
                                </SelectItem>
                              ) : (
                                brands.map((brand) => (
                                  <SelectItem key={brand.id} value={brand.name}>
                                    {brand.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setShowAddBrandDialog(true)}
                            title="Add new brand"
                            disabled={brandsLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., PND-EXT-500" />
                        </FormControl>
                        <FormDescription>
                          Unique product identifier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="retailPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retail Price (TSh) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (TSh)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Original price before discount (for sale calculations)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wholesalePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wholesale Price (TSh)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Price for bulk/wholesale orders
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormDescription>
                          Used for shipping calculations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stock *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock Level</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="5"
                          />
                        </FormControl>
                        <FormDescription>
                          Alert when stock falls below this level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {form.watch('tags').length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.watch('tags').map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      <AddBrandDialog
        open={showAddBrandDialog}
        onOpenChange={setShowAddBrandDialog}
        onBrandAdded={handleBrandAdded}
      />
    </div>
  );
}