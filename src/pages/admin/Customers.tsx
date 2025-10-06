import { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Users,
  UserCheck,
  MoreHorizontal,
  Loader2,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCustomers } from '@/hooks/useCustomers';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CustomerEmailDialog } from '@/components/admin/CustomerEmailDialog';
import { CustomerOrdersDialog } from '@/components/admin/CustomerOrdersDialog';
import { CustomerDetailsDialog } from '@/components/admin/CustomerDetailsDialog';

const statusConfig = {
  active: { label: 'Active', variant: 'default' as const },
  inactive: { label: 'Inactive', variant: 'secondary' as const },
  blocked: { label: 'Blocked', variant: 'destructive' as const }
};

const customerTypeConfig = {
  retail: { label: 'Retail', variant: 'outline' as const },
  wholesale: { label: 'Wholesale', variant: 'default' as const }
};

export default function CustomersPage() {
  const { data: customers = [], isLoading, error } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [ordersDialogOpen, setOrdersDialogOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesType = typeFilter === 'all' || customer.customerType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [customers, searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    wholesaleCustomers: customers.filter(c => c.customerType === 'wholesale').length,
    totalRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  }), [customers]);

  const handleExport = () => {
    const csvHeaders = [
      'Name',
      'Email',
      'Phone',
      'City',
      'Region',
      'Type',
      'Status',
      'Total Orders',
      'Total Spent (TSh)',
      'Join Date',
      'Last Order'
    ];

    const csvData = filteredCustomers.map(customer => [
      customer.name,
      customer.email,
      customer.phone,
      customer.address?.city || '',
      customer.address?.region || '',
      customer.customerType,
      customer.status,
      customer.totalOrders,
      customer.totalSpent,
      new Date(customer.joinDate).toLocaleDateString(),
      customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer data exported successfully');
  };

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleSendEmail = (customer: any) => {
    setSelectedCustomer(customer);
    setEmailDialogOpen(true);
  };

  const handleViewOrders = (customer: any) => {
    setSelectedCustomer(customer);
    setOrdersDialogOpen(true);
  };

  const CustomersTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customers Management</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading customers. Please try again.
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No customers found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      {customer.address ? (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {customer.address.city}, {customer.address.region}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No address</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customerTypeConfig[customer.customerType].variant}>
                      {customerTypeConfig[customer.customerType].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[customer.status].variant}>
                      {statusConfig[customer.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="font-medium">
                    TSh {customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {customer.lastOrder 
                      ? new Date(customer.lastOrder).toLocaleDateString()
                      : 'No orders'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewOrders(customer)}>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          View Orders
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
    </Card>
  );

  const CustomerAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Total registered customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCustomers > 0 
                ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) 
                : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wholesale Clients</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wholesaleCustomers}</div>
            <p className="text-xs text-muted-foreground">
              High value customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TSh {stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime customer value
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers by Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                    <Badge variant={customerTypeConfig[customer.customerType].variant}>
                      {customerTypeConfig[customer.customerType].label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">TSh {customer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{customer.totalOrders} orders</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Retail Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${stats.totalCustomers > 0 ? ((stats.totalCustomers - stats.wholesaleCustomers) / stats.totalCustomers) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {stats.totalCustomers - stats.wholesaleCustomers} ({stats.totalCustomers > 0 
                    ? Math.round(((stats.totalCustomers - stats.wholesaleCustomers) / stats.totalCustomers) * 100) 
                    : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full" />
                <span>Wholesale Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full" 
                    style={{ width: `${stats.totalCustomers > 0 ? (stats.wholesaleCustomers / stats.totalCustomers) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {stats.wholesaleCustomers} ({stats.totalCustomers > 0 
                    ? Math.round((stats.wholesaleCustomers / stats.totalCustomers) * 100) 
                    : 0}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customers Management</h2>
        <p className="text-muted-foreground">
          Manage customer relationships and track customer activity
        </p>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers">
          <CustomersTable />
        </TabsContent>
        
        <TabsContent value="analytics">
          <CustomerAnalytics />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      
      <CustomerEmailDialog
        customer={selectedCustomer}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />
      
      <CustomerOrdersDialog
        customer={selectedCustomer}
        open={ordersDialogOpen}
        onOpenChange={setOrdersDialogOpen}
      />
    </div>
  );
}