import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  DollarSign,
  Building2
} from 'lucide-react';

interface CustomerDetailsDialogProps {
  customer: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; variant: any }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  blocked: { label: 'Blocked', variant: 'destructive' }
};

const customerTypeConfig: Record<string, { label: string; variant: any }> = {
  retail: { label: 'Retail', variant: 'outline' },
  wholesale: { label: 'Wholesale', variant: 'default' }
};

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{customer.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusConfig[customer.status]?.variant || 'secondary'}>
                  {statusConfig[customer.status]?.label || customer.status}
                </Badge>
                <Badge variant={customerTypeConfig[customer.customerType]?.variant || 'outline'}>
                  {customerTypeConfig[customer.customerType]?.label || customer.customerType}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Customer ID</div>
              <div className="font-mono text-sm">{customer.id.slice(0, 8)}</div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{customer.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </h4>
            {customer.address ? (
              <div className="space-y-2 text-sm">
                {customer.address.street && (
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{customer.address.street}</div>
                      <div className="text-muted-foreground">
                        {customer.address.city}, {customer.address.region}
                      </div>
                      {customer.address.postalCode && (
                        <div className="text-muted-foreground">
                          Postal Code: {customer.address.postalCode}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!customer.address.street && (
                  <div className="text-muted-foreground">
                    {customer.address.city}, {customer.address.region}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No address provided</div>
            )}
          </div>

          <Separator />

          {/* Order Statistics */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Order Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  Total Orders
                </div>
                <div className="text-2xl font-bold">{customer.totalOrders}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  Total Spent
                </div>
                <div className="text-2xl font-bold">TSh {customer.totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Account Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Join Date:</span>
                <span className="font-medium">
                  {new Date(customer.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Order:</span>
                <span className="font-medium">
                  {customer.lastOrder 
                    ? new Date(customer.lastOrder).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'No orders yet'}
                </span>
              </div>
              {customer.averageOrderValue && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Order Value:</span>
                  <span className="font-medium">
                    TSh {customer.averageOrderValue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
