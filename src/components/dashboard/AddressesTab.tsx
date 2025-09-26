import { useState } from 'react';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress, Address } from '@/hooks/useUserDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Home,
  Building,
  Loader2
} from 'lucide-react';

interface AddressFormData {
  label: string;
  street: string;
  city: string;
  region: string;
  postal_code: string;
  is_default: boolean;
}

const initialFormData: AddressFormData = {
  label: '',
  street: '',
  city: '',
  region: '',
  postal_code: '',
  is_default: false,
};

export const AddressesTab = () => {
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label,
        street: address.street,
        city: address.city,
        region: address.region,
        postal_code: address.postal_code || '',
        is_default: address.is_default,
      });
    } else {
      setEditingAddress(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({
          id: editingAddress.id,
          ...formData,
        });
      } else {
        await addAddressMutation.mutateAsync(formData);
      }
      handleCloseDialog();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddressMutation.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await updateAddressMutation.mutateAsync({
        id: address.id,
        is_default: true,
      });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const getAddressIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('home') || lowerLabel.includes('house')) {
      return <Home className="w-4 h-4" />;
    } else if (lowerLabel.includes('office') || lowerLabel.includes('work')) {
      return <Building className="w-4 h-4" />;
    }
    return <MapPin className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Delivery Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your delivery addresses for faster checkout
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Address Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Home, Office"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    placeholder="Region"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code (Optional)</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="Postal code"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_default">Set as default address</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                >
                  {(addAddressMutation.isPending || updateAddressMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingAddress ? 'Update' : 'Add'} Address
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No addresses added</h3>
              <p className="text-muted-foreground mb-4">
                Add your delivery addresses for faster checkout
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.is_default ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getAddressIcon(address.label)}
                    <CardTitle className="text-base">{address.label}</CardTitle>
                    {address.is_default && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(address)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(address.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.region}
                    {address.postal_code && ` ${address.postal_code}`}
                  </p>
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address)}
                      disabled={updateAddressMutation.isPending}
                      className="mt-2"
                    >
                      {updateAddressMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};