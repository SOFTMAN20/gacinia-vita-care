import { useState } from 'react';
import { usePrescriptions, useAddPrescription, Prescription } from '@/hooks/useUserDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Upload, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Eye
} from 'lucide-react';

interface PrescriptionFormData {
  name: string;
  description: string;
  doctor_name: string;
  expiry_date: string;
  notes: string;
}

const initialFormData: PrescriptionFormData = {
  name: '',
  description: '',
  doctor_name: '',
  expiry_date: '',
  notes: '',
};

export const PrescriptionsTab = () => {
  const { data: prescriptions = [], isLoading } = usePrescriptions();
  const addPrescriptionMutation = useAddPrescription();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PrescriptionFormData>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData(initialFormData);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image (JPG, PNG) or PDF file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a prescription file to upload');
      return;
    }

    try {
      // TODO: Upload file to Supabase Storage and get URL
      const imageUrl = ''; // This would be the uploaded file URL
      
      await addPrescriptionMutation.mutateAsync({
        ...formData,
        image_url: imageUrl,
        status: 'pending',
      });
      
      handleCloseDialog();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Prescription Management</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage your medical prescriptions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Prescription Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Blood Pressure Medication"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the prescription"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor_name">Doctor's Name</Label>
                <Input
                  id="doctor_name"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  placeholder="Prescribing doctor's name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescription_file">Prescription File</Label>
                <Input
                  id="prescription_file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload image (JPG, PNG) or PDF file. Max size: 5MB
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes or instructions"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addPrescriptionMutation.isPending}
                >
                  {addPrescriptionMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Upload Prescription
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No prescriptions uploaded</h3>
              <p className="text-muted-foreground mb-4">
                Upload your prescriptions to order prescription medications
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{prescription.name}</CardTitle>
                    {prescription.description && (
                      <p className="text-sm text-muted-foreground">
                        {prescription.description}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(prescription.status)}>
                    {getStatusIcon(prescription.status)}
                    <span className="ml-1 capitalize">{prescription.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Upload Date</p>
                        <p className="text-muted-foreground">
                          {new Date(prescription.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {prescription.expiry_date && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className={`w-4 h-4 ${
                          isExpiringSoon(prescription.expiry_date) 
                            ? 'text-yellow-500' 
                            : 'text-muted-foreground'
                        }`} />
                        <div>
                          <p className="font-medium">Expiry Date</p>
                          <p className={`${
                            isExpiringSoon(prescription.expiry_date)
                              ? 'text-yellow-600 font-medium'
                              : 'text-muted-foreground'
                          }`}>
                            {new Date(prescription.expiry_date).toLocaleDateString()}
                            {isExpiringSoon(prescription.expiry_date) && (
                              <span className="text-xs ml-1">(Expiring Soon)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {prescription.doctor_name && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Doctor</p>
                          <p className="text-muted-foreground">{prescription.doctor_name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {prescription.notes && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground">{prescription.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-xs text-muted-foreground">
                      ID: {prescription.id.slice(0, 8)}...
                    </div>
                    <div className="flex space-x-2">
                      {prescription.image_url && (
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View File
                        </Button>
                      )}
                      {prescription.status === 'approved' && (
                        <Button size="sm">
                          Order Medication
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Renewal Reminders */}
      {prescriptions.some(p => p.expiry_date && isExpiringSoon(p.expiry_date)) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Prescription Renewal Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prescriptions
                .filter(p => p.expiry_date && isExpiringSoon(p.expiry_date))
                .map(prescription => (
                  <div key={prescription.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <p className="font-medium text-sm">{prescription.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {prescription.expiry_date && new Date(prescription.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Renew Now
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};