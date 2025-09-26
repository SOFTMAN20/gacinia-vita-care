import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Package,
  MapPin,
  FileText,
  Heart,
  Settings,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useAddresses, 
  useUserOrders, 
  usePrescriptions, 
  useWishlist 
} from '@/hooks/useUserDashboard';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { OrdersTab } from '@/components/dashboard/OrdersTab';
import { AddressesTab } from '@/components/dashboard/AddressesTab';
import { PrescriptionsTab } from '@/components/dashboard/PrescriptionsTab';
import { WishlistTab } from '@/components/dashboard/WishlistTab';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();

  // Fetch real data from Supabase
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const { data: orders = [], isLoading: ordersLoading } = useUserOrders();
  const { data: prescriptions = [], isLoading: prescriptionsLoading } = usePrescriptions();
  const { data: wishlist = [], isLoading: wishlistLoading } = useWishlist();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (profile?.role === 'admin') {
      navigate('/admin');
    }
  }, [profile, navigate]);

  const isLoading = addressesLoading || ordersLoading || prescriptionsLoading || wishlistLoading;

  // Don't show loading for individual sections, just for initial load
  const isInitialLoading = addressesLoading && ordersLoading && prescriptionsLoading && wishlistLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-orange-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPrescriptionStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const recentOrders = orders.slice(0, 3);
  const approvedPrescriptions = prescriptions.filter(p => p.status === 'approved');

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={cartState.totalItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={cartState.totalItems} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-muted-foreground">
            Manage your account, orders, and health information
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{prescriptions.length}</p>
                  <p className="text-sm text-muted-foreground">Prescriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{wishlist.length}</p>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {approvedPrescriptions.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved Prescriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Recent Orders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.order_number || `Order #${order.id.slice(0, 8)}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status}
                          </Badge>
                          <p className="text-sm mt-1">TZS {order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard?tab=orders">View All Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Prescription Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptions.slice(0, 3).map((prescription) => (
                      <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{prescription.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {prescription.expiry_date 
                              ? `Expires: ${new Date(prescription.expiry_date).toLocaleDateString()}`
                              : `Uploaded: ${new Date(prescription.upload_date).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPrescriptionStatusIcon(prescription.status)}
                          <span className="text-sm capitalize">{prescription.status}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard?tab=prescriptions">Manage Prescriptions</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex-col space-y-2" asChild>
                    <Link to="/products">
                      <ShoppingCart className="w-6 h-6" />
                      <span>Shop Now</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <FileText className="w-6 h-6" />
                    <span>Upload Prescription</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <MapPin className="w-6 h-6" />
                    <span>Add Address</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Settings className="w-6 h-6" />
                    <span>Account Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressesTab />
          </TabsContent>

          <TabsContent value="prescriptions">
            <PrescriptionsTab />
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistTab />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}