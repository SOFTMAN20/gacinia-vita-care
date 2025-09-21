import { useState, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X,
  FolderTree,
  Tag,
  Loader2
} from 'lucide-react';

import { useAdminCategories } from '@/hooks/useAdminCategories';
import { OptimizedImage } from '@/components/ui/image-optimization';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/ui/image-uploader';

interface CategoryFormData {
  name: string;
  nameSwahili: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default function CategoriesManager() {
  const { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useAdminCategories();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameSwahili: '',
    description: '',
    image: '',
    isActive: true
  });

  const handleInputChange = useCallback((field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameSwahili: '',
      description: '',
      image: '',
      isActive: true
    });
  };

  const handleSave = useCallback(async () => {
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, {
          name: formData.name,
          name_swahili: formData.nameSwahili,
          description: formData.description,
          image_url: formData.image,
          is_active: formData.isActive
        });
        setEditingCategory(null);
      } else {
        // Add new category
        await createCategory({
          name: formData.name,
          name_swahili: formData.nameSwahili,
          description: formData.description,
          image_url: formData.image,
          is_active: formData.isActive
        });
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      // Error is handled in the hook
    }
  }, [editingCategory, formData, updateCategory, createCategory, resetForm]);

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameSwahili: category.name_swahili || '',
      description: category.description || '',
      image: category.image_url || '',
      isActive: category.is_active
    });
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleImagesChange = useCallback((images: string[]) => {
    handleInputChange('image', images[0] || '');
  }, [handleInputChange]);

  const CategoryForm = useMemo(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category-name">Category Name *</Label>
          <Input
            id="category-name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter category name"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="category-name-swahili">Name (Kiswahili)</Label>
          <Input
            id="category-name-swahili"
            value={formData.nameSwahili}
            onChange={(e) => handleInputChange('nameSwahili', e.target.value)}
            placeholder="Jina la jamii kwa Kiswahili"
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category-description">Description</Label>
        <Textarea
          id="category-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Category description"
          rows={3}
          autoComplete="off"
        />
      </div>

      <div>
        <Label htmlFor="image">Category Image</Label>
        <ImageUploader
          bucket="category-images"
          maxFiles={1}
          currentImages={formData.image ? [formData.image] : []}
          onImagesChange={handleImagesChange}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label>Active Status</Label>
          <p className="text-sm text-muted-foreground">
            Make this category visible to customers
          </p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (editingCategory) {
              setEditingCategory(null);
            } else {
              setIsAddDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!formData.name.trim()}>
          <Save className="w-4 h-4 mr-2" />
          {editingCategory ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </div>
  ), [formData, editingCategory, handleInputChange, handleImagesChange, handleSave, resetForm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading categories: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories Management</h2>
          <p className="text-muted-foreground">
            Organize your products into categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category for your store
              </DialogDescription>
            </DialogHeader>
{CategoryForm}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Tag className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.product_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {category.image_url ? (
                <OptimizedImage 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={category.is_active ? "default" : "secondary"}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {category.product_count} products
                  </span>
                </div>
                
                {category.name_swahili && (
                  <p className="text-sm text-muted-foreground italic">
                    {category.name_swahili}
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? 
                            This action cannot be undone and will affect {category.product_count} products.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category information
              </DialogDescription>
            </DialogHeader>
{CategoryForm}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}