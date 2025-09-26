import { useState } from 'react';
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
  MoreHorizontal
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    region: string;
  };
  joinDate: string;
  lastOrder: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'retail' | 'wholesale';
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+255 123 456 789',
    address: {
      street: '123 Main Street',
      city: 'Mwanza',
      region: 'Mwanza'
    },
    joinDate: '2023-06-15',
    lastOrder: '2024-01-15',
    totalOrders: 12,
    totalSpent: 450000,
    status: 'active',
    customerType: 'retail'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+255 987 654 321',
    address: {
      street: '456 Oak Avenue',
      city: 'Dar es Salaam',
      region: 'Dar es Salaam'
    },
    joinDate: '2023-08-20',
    lastOrder: '2024-01-10',
    totalOrders: 8,
    totalSpent: 320000,
    status: 'active',
    customerType: 'retail'
  },
  {
    id: '3',
    name: 'Mbeya General Hospital',
    email: 'procurement@mbeyahospital.go.tz',
    phone: '+255 555 111 222',
    address: {
      street: 'Hospital Road',
      city: 'Mbeya',
      region: 'Mbeya'
    },
    joinDate: '2023-03-10',
    lastOrder: '2024-01-12',
    totalOrders: 45,
    totalSpent: 12500000,
    status: 'active',
    customerType: 'wholesale'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+255 777 888 999',
    address: {
      street: '789 Pine Street',
      city: 'Arusha',
      region: 'Arusha'
    },
    joinDate: '2023-11-05',
    lastOrder: '2023-12-20',
    totalOrders: 3,
    totalSpent: 95000,
    status: 'inactive',
    customerType: 'retail'
  }
];

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
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.customerType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const wholesaleCustomers = customers.filter(c => c.customerType === 'wholesale').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

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
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {customer.address.city}, {customer.address.region}
                      </div>
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
                    {new Date(customer.lastOrder).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeCustomers / totalCustomers) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wholesale Clients</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wholesaleCustomers}</div>
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
            <div className="text-2xl font-bold">TSh {totalRevenue.toLocaleString()}</div>
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
                    style={{ width: `${((totalCustomers - wholesaleCustomers) / totalCustomers) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {totalCustomers - wholesaleCustomers} ({Math.round(((totalCustomers - wholesaleCustomers) / totalCustomers) * 100)}%)
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
                    style={{ width: `${(wholesaleCustomers / totalCustomers) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {wholesaleCustomers} ({Math.round((wholesaleCustomers / totalCustomers) * 100)}%)
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
    </div>
  );
}