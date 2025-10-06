import { useState } from 'react';
import { 
  Store,
  Bell,
  Mail,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Truck,
  FileText,
  Database,
  Key,
  Users,
  Save,
  RefreshCw,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

export default function Settings() {
  const { settings, loading, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    storeName: settings?.store_name || 'Gacinia Pharmacy & Medical Supplies',
    storeEmail: settings?.store_email || 'info@gacinia.co.tz',
    storePhone: settings?.store_phone || '+255 123 456 789',
    storeAddress: settings?.store_address || 'Dar es Salaam, Tanzania',
    currency: settings?.currency || 'TSh',
    timezone: settings?.timezone || 'Africa/Dar_es_Salaam',
    language: settings?.language || 'en',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: settings?.email_notifications ?? true,
    orderNotifications: settings?.order_notifications ?? true,
    lowStockAlerts: settings?.low_stock_alerts ?? true,
    customerMessages: settings?.customer_messages ?? true,
    marketingEmails: settings?.marketing_emails ?? false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    cashOnDelivery: settings?.payment_cod ?? true,
    mobileMoneyEnabled: settings?.payment_mobile_money ?? true,
    bankTransferEnabled: settings?.payment_bank_transfer ?? true,
    cardPaymentEnabled: settings?.payment_card ?? false,
  });

  const [deliverySettings, setDeliverySettings] = useState({
    freeDeliveryThreshold: settings?.free_delivery_threshold || 50000,
    standardDeliveryFee: settings?.standard_delivery_fee || 5000,
    expressDeliveryFee: settings?.express_delivery_fee || 10000,
    deliveryRadius: settings?.delivery_radius || 50,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: settings?.two_factor_auth ?? false,
    sessionTimeout: settings?.session_timeout || 30,
    passwordExpiry: settings?.password_expiry || 90,
    loginAttempts: settings?.max_login_attempts || 5,
  });

  const handleSaveStoreSettings = async () => {
    setSaving(true);
    try {
      await updateSettings({
        store_name: storeSettings.storeName,
        store_email: storeSettings.storeEmail,
        store_phone: storeSettings.storePhone,
        store_address: storeSettings.storeAddress,
        currency: storeSettings.currency,
        timezone: storeSettings.timezone,
        language: storeSettings.language,
      });
      toast.success('Store settings saved successfully');
    } catch (error) {
      toast.error('Failed to save store settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await updateSettings({
        email_notifications: notificationSettings.emailNotifications,
        order_notifications: notificationSettings.orderNotifications,
        low_stock_alerts: notificationSettings.lowStockAlerts,
        customer_messages: notificationSettings.customerMessages,
        marketing_emails: notificationSettings.marketingEmails,
      });
      toast.success('Notification settings saved successfully');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    setSaving(true);
    try {
      await updateSettings({
        payment_cod: paymentSettings.cashOnDelivery,
        payment_mobile_money: paymentSettings.mobileMoneyEnabled,
        payment_bank_transfer: paymentSettings.bankTransferEnabled,
        payment_card: paymentSettings.cardPaymentEnabled,
      });
      toast.success('Payment settings saved successfully');
    } catch (error) {
      toast.error('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDeliverySettings = async () => {
    setSaving(true);
    try {
      await updateSettings({
        free_delivery_threshold: deliverySettings.freeDeliveryThreshold,
        standard_delivery_fee: deliverySettings.standardDeliveryFee,
        express_delivery_fee: deliverySettings.expressDeliveryFee,
        delivery_radius: deliverySettings.deliveryRadius,
      });
      toast.success('Delivery settings saved successfully');
    } catch (error) {
      toast.error('Failed to save delivery settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setSaving(true);
    try {
      await updateSettings({
        two_factor_auth: securitySettings.twoFactorAuth,
        session_timeout: securitySettings.sessionTimeout,
        password_expiry: securitySettings.passwordExpiry,
        max_login_attempts: securitySettings.loginAttempts,
      });
      toast.success('Security settings saved successfully');
    } catch (error) {
      toast.error('Failed to save security settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your pharmacy system configuration
          </p>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="store" className="text-xs sm:text-sm">
            <Store className="h-4 w-4 mr-1" />
            Store
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            <Bell className="h-4 w-4 mr-1" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs sm:text-sm">
            <CreditCard className="h-4 w-4 mr-1" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="delivery" className="text-xs sm:text-sm">
            <Truck className="h-4 w-4 mr-1" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            <Shield className="h-4 w-4 mr-1" />
            Security
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs sm:text-sm">
            <Database className="h-4 w-4 mr-1" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Store Settings Tab */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your pharmacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    placeholder="Your pharmacy name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    placeholder="info@pharmacy.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                    placeholder="+255 123 456 789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) => setStoreSettings({ ...storeSettings, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TSh">Tanzanian Shilling (TSh)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                  placeholder="Full store address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={storeSettings.timezone}
                    onValueChange={(value) => setStoreSettings({ ...storeSettings, timezone: value })}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dar_es_Salaam">East Africa Time (EAT)</SelectItem>
                      <SelectItem value="Africa/Nairobi">East Africa Time (Nairobi)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={storeSettings.language}
                    onValueChange={(value) => setStoreSettings({ ...storeSettings, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveStoreSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new orders
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, orderNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when products are running low
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Customer Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for customer inquiries
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.customerMessages}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, customerMessages: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive marketing and promotional emails
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure available payment options for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cash on Delivery</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to pay upon delivery
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.cashOnDelivery}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, cashOnDelivery: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mobile Money (M-Pesa, Tigo Pesa)</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept mobile money payments
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.mobileMoneyEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, mobileMoneyEnabled: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bank Transfer</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept direct bank transfers
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.bankTransferEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, bankTransferEnabled: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Card Payments</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept credit/debit card payments
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.cardPaymentEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, cardPaymentEnabled: checked })
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePaymentSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Configuration</CardTitle>
              <CardDescription>
                Set up delivery fees and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (TSh)</Label>
                  <Input
                    id="freeDeliveryThreshold"
                    type="number"
                    value={deliverySettings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: Number(e.target.value) })
                    }
                    placeholder="50000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Orders above this amount get free delivery
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standardDeliveryFee">Standard Delivery Fee (TSh)</Label>
                  <Input
                    id="standardDeliveryFee"
                    type="number"
                    value={deliverySettings.standardDeliveryFee}
                    onChange={(e) =>
                      setDeliverySettings({ ...deliverySettings, standardDeliveryFee: Number(e.target.value) })
                    }
                    placeholder="5000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee for standard delivery (3-5 days)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expressDeliveryFee">Express Delivery Fee (TSh)</Label>
                  <Input
                    id="expressDeliveryFee"
                    type="number"
                    value={deliverySettings.expressDeliveryFee}
                    onChange={(e) =>
                      setDeliverySettings({ ...deliverySettings, expressDeliveryFee: Number(e.target.value) })
                    }
                    placeholder="10000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee for express delivery (1-2 days)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                  <Input
                    id="deliveryRadius"
                    type="number"
                    value={deliverySettings.deliveryRadius}
                    onChange={(e) =>
                      setDeliverySettings({ ...deliverySettings, deliveryRadius: Number(e.target.value) })
                    }
                    placeholder="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum delivery distance from store
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveDeliverySettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access Control</CardTitle>
              <CardDescription>
                Manage security settings and access policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) })
                    }
                    placeholder="30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-logout after inactivity
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, passwordExpiry: Number(e.target.value) })
                    }
                    placeholder="90"
                  />
                  <p className="text-xs text-muted-foreground">
                    Force password change after this period
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, loginAttempts: Number(e.target.value) })
                    }
                    placeholder="5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lock account after failed attempts
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSecuritySettings} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>
                System maintenance and advanced options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Database Backup
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Create a backup of your database
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Clear Cache
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Clear system cache to improve performance
                      </p>
                    </div>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Export Data
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Export all data in CSV format
                      </p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        API Keys
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Manage API keys for integrations
                      </p>
                    </div>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Manage Keys
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User Roles
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Configure user roles and permissions
                      </p>
                    </div>
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Roles
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions - proceed with caution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-destructive">Reset All Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Reset all settings to default values
                    </p>
                  </div>
                  <Button variant="destructive">
                    Reset Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
