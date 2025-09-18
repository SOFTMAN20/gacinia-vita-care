import { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ProductForm from '@/components/admin/ProductForm';

// Mock data for admin dashboard
const dashboardData = {
  kpis: [
    {
      title: 'Total Revenue',
      value: 'TSh 2,450,000',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'Orders Today',
      value: '43',
      change: '+8.2%',
      icon: ShoppingCart,
      trend: 'up'
    },
    {
      title: 'Active Customers',
      value: '1,247',
      change: '+15.3%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Products',
      value: '856',
      change: '+5.1%',
      icon: Package,
      trend: 'up'
    }
  ],
  recentOrders: [
    {
      id: 'ORD-001',
      customer: 'John Mwangi',
      amount: 'TSh 45,000',
      status: 'pending',
      date: '2024-01-10'
    },
    {
      id: 'ORD-002', 
      customer: 'Mary Kassim',
      amount: 'TSh 78,500',
      status: 'confirmed',
      date: '2024-01-10'
    },
    {
      id: 'ORD-003',
      customer: 'Peter Mgoma',
      amount: 'TSh 32,000',
      status: 'shipped',
      date: '2024-01-09'
    },
    {
      id: 'ORD-004',
      customer: 'Grace Mduma',
      amount: 'TSh 156,000',
      status: 'delivered',
      date: '2024-01-09'
    },
    {
      id: 'ORD-005',
      customer: 'James Kileo',
      amount: 'TSh 89,000',
      status: 'cancelled',
      date: '2024-01-08'
    }
  ],
  lowStockAlerts: [
    { name: 'Panadol Extra', current: 8, minimum: 20, category: 'Pain Relief' },
    { name: 'Blood Pressure Monitor', current: 2, minimum: 5, category: 'Equipment' },
    { name: 'Amoxicillin 500mg', current: 15, minimum: 50, category: 'Antibiotics' },
    { name: 'Vitamin C Tablets', current: 12, minimum: 30, category: 'Supplements' }
  ],
  pendingPrescriptions: [
    { id: 'RX-001', patient: 'Ahmed Hassan', medication: 'Insulin Glargine', submitted: '2 hours ago' },
    { id: 'RX-002', patient: 'Fatuma Ally', medication: 'Metformin 850mg', submitted: '4 hours ago' },
    { id: 'RX-003', patient: 'Robert Mushi', medication: 'Lisinopril 10mg', submitted: '6 hours ago' }
  ]
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
    confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
    shipped: { label: 'Shipped', variant: 'default' as const, icon: TrendingUp },
    delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon size={12} />
      {config.label}
    </Badge>
  );
};

export default function AdminDashboard() {
  const [showProductForm, setShowProductForm] = useState(false);

  const handleProductSubmit = (data: Record<string, unknown> & { images: string[] }) => {
    console.log('Product submitted:', data);
    setShowProductForm(false);
    // Here you would typically make an API call to save the product
  };

  const handleProductCancel = () => {
    setShowProductForm(false);
  };

  // If product form is open, show it instead of dashboard
  if (showProductForm) {
    return (
      <ProductForm
        onSubmit={handleProductSubmit}
        onCancel={handleProductCancel}
        isLoading={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here's what's happening with your pharmacy today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline">View Reports</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.kpis.map((kpi, index) => (
          <Card key={index} className="pharmacy-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp size={12} />
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="ghost" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground">{order.id}</p>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle size={20} />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.lowStockAlerts.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge variant="destructive">
                      {item.current}/{item.minimum}
                    </Badge>
                  </div>
                  <Progress 
                    value={(item.current / item.minimum) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pending Prescription Approvals
            <Badge variant="secondary">{dashboardData.pendingPrescriptions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData.pendingPrescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{prescription.id}</p>
                    <Badge variant="outline">{prescription.submitted}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Patient: {prescription.patient}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {prescription.medication}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}