import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Globe, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileTab = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    phone: profile?.phone || '',
    email: user?.email || '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  });

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      phone: profile?.phone || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+255 123 456 789"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive order updates and promotions via email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive order updates via SMS
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, sms: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, push: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Account Type</Label>
              <p className="text-sm text-muted-foreground capitalize">
                {profile?.role || 'Customer'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Member Since</Label>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};