import { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Save,
  X,
  FolderTree,
  Tag
} from 'lucide-react';

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

interface Category {
  id: string;
  name: string;
  nameSwahili: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  isActive: boolean;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Prescription Medicines',
    nameSwahili: 'Dawa za Prescription',
    slug: 'prescription-medicines',
    description: 'Medicines requiring valid prescription',
    image: '/placeholder-category.jpg',
    isActive: true,
    productCount: 45,
    sortOrder: 1
  },
  {
    id: '2',
    name: 'Over-the-Counter',
    nameSwahili: 'Dawa za Kawaida',
    slug: 'over-the-counter',
    description: 'Medicines available without prescription',
    image: '/placeholder-category.jpg',
    isActive: true,
    productCount: 62,
    sortOrder: 2
  },
  {
    id: '3',
    name: 'Medical Equipment',
    nameSwahili: 'Vifaa vya Kidaktari',
    slug: 'medical-equipment',
    description: 'Medical devices and equipment',
    image: '/placeholder-category.jpg',
    isActive: true,
    productCount: 28,
    sortOrder: 3
  },
  {
    id: '4',
    name: 'Cosmetics & Personal Care',
    nameSwahili: 'Vipodozi na Huduma za Kibinafsi',
    slug: 'cosmetics-personal-care',
    description: 'Beauty and personal care products',
    image: '/placeholder-category.jpg',
    isActive: true,
    productCount: 34,
    sortOrder: 4
  }
];

interface CategoryFormData {
  name: string;
  nameSwahili: string;
  description: string;
  image: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameSwahili: '',
    description: '',
    image: '',
    isActive: true,
    seoTitle: '',
    seoDescription: ''
  });

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameSwahili: '',
      description: '',
      image: '',
      isActive: true,
      seoTitle: '',
      seoDescription: ''
    });
  };

  const handleSave = () => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? {
              ...cat,
              ...formData,
              slug: generateSlug(formData.name)
            }
          : cat
      ));
      setEditingCategory(null);
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        slug: generateSlug(formData.name),
        productCount: 0,
        sortOrder: categories.length + 1
      };
      setCategories(prev => [...prev, newCategory]);
      setIsAddDialogOpen(false);
    }
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameSwahili: category.nameSwahili,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || ''
    });
  };

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleInputChange('image', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const CategoryForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <div>
          <Label htmlFor="nameSwahili">Name (Kiswahili)</Label>
          <Input
            id="nameSwahili"
            value={formData.nameSwahili}
            onChange={(e) => handleInputChange('nameSwahili', e.target.value)}
            placeholder="Jina la jamii kwa Kiswahili"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Category description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">Category Image</Label>
        <div className="flex items-center gap-4">
          {formData.image && (
            <img 
              src={formData.image} 
              alt="Category" 
              className="w-16 h-16 object-cover rounded-lg border"
            />
          )}
          <div className="flex-1">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium"
            />
          </div>
        </div>
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

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium">SEO Settings</h4>
        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={formData.seoTitle}
            onChange={(e) => handleInputChange('seoTitle', e.target.value)}
            placeholder="SEO optimized title"
          />
        </div>
        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={formData.seoDescription}
            onChange={(e) => handleInputChange('seoDescription', e.target.value)}
            placeholder="SEO meta description"
            rows={2}
          />
        </div>
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
  );

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
            <CategoryForm />
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
              {categories.filter(cat => cat.isActive).length}
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
              {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {category.productCount} products
                  </span>
                </div>
                
                {category.nameSwahili && (
                  <p className="text-sm text-muted-foreground italic">
                    {category.nameSwahili}
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
                            This action cannot be undone and will affect {category.productCount} products.
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
            <CategoryForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}