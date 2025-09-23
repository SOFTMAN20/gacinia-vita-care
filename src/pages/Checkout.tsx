import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { useProcessOrder } from '@/hooks/useProcessOrder';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  Clock,
  AlertTriangle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

type CheckoutStep = 'review' | 'delivery' | 'payment' | 'confirmation';

interface DeliveryInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  deliveryType: 'delivery' | 'pickup';
  timeSlot: string;
  instructions: string;
}

interface PaymentInfo {
  method: 'mpesa' | 'bank' | 'cod';
  mpesaPhone: string;
  bankDetails: string;
}

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processOrder, loading: orderLoading } = useProcessOrder();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mbeya',
    region: 'Mbeya',
    postalCode: '',
    deliveryType: 'delivery',
    timeSlot: '',
    instructions: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'mpesa',
    mpesaPhone: '',
    bankDetails: ''
  });

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const steps = [
    { id: 'review', title: 'Order Review', icon: CheckCircle },
    { id: 'delivery', title: 'Delivery Info', icon: MapPin },
    { id: 'payment', title: 'Payment', icon: CreditCard },
    { id: 'confirmation', title: 'Confirmation', icon: CheckCircle }
  ];

  const handleNextStep = () => {
    const stepOrder: CheckoutStep[] = ['review', 'delivery', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const stepOrder: CheckoutStep[] = ['review', 'delivery', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare order data for the new edge function
      const orderData = {
        delivery_address: {
          fullName: deliveryInfo.fullName,
          phone: deliveryInfo.phone,
          email: deliveryInfo.email,
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          region: deliveryInfo.region,
          postalCode: deliveryInfo.postalCode,
          deliveryType: deliveryInfo.deliveryType,
          timeSlot: deliveryInfo.timeSlot,
          instructions: deliveryInfo.instructions
        },
        payment_method: paymentInfo.method,
        notes: deliveryInfo.instructions
      };

      // Use the new processOrder function which calls our edge function
      const order = await processOrder(orderData);
      setOrderNumber(order.order_number || `GCN${Date.now().toString().slice(-6)}`);
      setCurrentStep('confirmation');

    } catch (error) {
      console.error('Error placing order:', error);
      // Error handling is already done in useProcessOrder hook
    } finally {
      setIsProcessing(false);
    }
  };

  const isStepValid = (step: CheckoutStep) => {
    switch (step) {
      case 'review':
        return state.items.length > 0;
      case 'delivery':
        return deliveryInfo.fullName && deliveryInfo.phone && deliveryInfo.address;
      case 'payment':
        return paymentInfo.method && (
          paymentInfo.method === 'cod' || 
          (paymentInfo.method === 'mpesa' && paymentInfo.mpesaPhone) ||
          (paymentInfo.method === 'bank' && paymentInfo.bankDetails)
        );
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'review':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      {item.product.requires_prescription && (
                        <Badge variant="outline" className="mt-1">
                          <AlertTriangle size={12} className="mr-1" />
                          Prescription Required
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        TZS {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>TZS {state.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>TZS {state.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>TZS {state.deliveryFee.toLocaleString()}</span>
                </div>
                {state.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-TZS {state.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>TZS {state.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'delivery':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={deliveryInfo.fullName}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, fullName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                    placeholder="+255 xxx xxx xxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={deliveryInfo.email}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={deliveryInfo.region}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, region: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={deliveryInfo.postalCode}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, postalCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Delivery Option</Label>
                <RadioGroup
                  value={deliveryInfo.deliveryType}
                  onValueChange={(value) => setDeliveryInfo({...deliveryInfo, deliveryType: value as 'delivery' | 'pickup'})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center gap-2">
                      <Truck size={16} />
                      Home Delivery (TZS 5,000)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex items-center gap-2">
                      <MapPin size={16} />
                      Pickup from Pharmacy (Free)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                <RadioGroup
                  value={deliveryInfo.timeSlot}
                  onValueChange={(value) => setDeliveryInfo({...deliveryInfo, timeSlot: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="morning" id="morning" />
                    <Label htmlFor="morning">Morning (8:00 AM - 12:00 PM)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afternoon" id="afternoon" />
                    <Label htmlFor="afternoon">Afternoon (12:00 PM - 6:00 PM)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="evening" id="evening" />
                    <Label htmlFor="evening">Evening (6:00 PM - 8:00 PM)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={deliveryInfo.instructions}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, instructions: e.target.value})}
                  placeholder="Any special delivery instructions..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentInfo.method}
                onValueChange={(value) => setPaymentInfo({...paymentInfo, method: value as any})}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer">
                      <Phone size={16} />
                      M-Pesa
                    </Label>
                  </div>
                  {paymentInfo.method === 'mpesa' && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                      <Input
                        id="mpesaPhone"
                        value={paymentInfo.mpesaPhone}
                        onChange={(e) => setPaymentInfo({...paymentInfo, mpesaPhone: e.target.value})}
                        placeholder="+255 xxx xxx xxx"
                      />
                      <p className="text-xs text-muted-foreground">
                        You will receive an STK push to complete payment
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard size={16} />
                      Bank Transfer
                    </Label>
                  </div>
                  {paymentInfo.method === 'bank' && (
                    <div className="ml-6 space-y-2">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Bank Details:</h4>
                        <p className="text-sm">Bank: CRDB Bank</p>
                        <p className="text-sm">Account: 0150-XXX-XXX</p>
                        <p className="text-sm">Reference: {`GCN${Date.now().toString().slice(-6)}`}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Truck size={16} />
                      Cash on Delivery
                    </Label>
                  </div>
                  {paymentInfo.method === 'cod' && (
                    <div className="ml-6">
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered. Additional TZS 2,000 COD fee applies.
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>TZS {(state.total + (paymentInfo.method === 'cod' ? 2000 : 0)).toLocaleString()}</span>
                </div>
                {paymentInfo.method === 'cod' && (
                  <p className="text-sm text-muted-foreground">
                    Includes TZS 2,000 Cash on Delivery fee
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'confirmation':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">Order Confirmed!</h2>
              <p className="text-muted-foreground">
                Thank you for your order. We'll process it shortly.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-xl font-bold">{orderNumber}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Delivery Address:</p>
                    <p className="text-muted-foreground">{deliveryInfo.address}</p>
                    <p className="text-muted-foreground">{deliveryInfo.city}, {deliveryInfo.region}</p>
                  </div>
                  <div>
                    <p className="font-medium">Estimated Delivery:</p>
                    <p className="text-muted-foreground">
                      {deliveryInfo.deliveryType === 'pickup' ? 'Ready for pickup' : '1-2 business days'}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid:</span>
                    <span>TZS {(state.total + (paymentInfo.method === 'cod' ? 2000 : 0)).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={() => navigate('/')} size="lg">
                Continue Shopping
              </Button>
              <p className="text-sm text-muted-foreground">
                We'll send you order updates via SMS and email
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={state.totalItems} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive ? 'border-primary bg-primary text-primary-foreground' :
                      isCompleted ? 'border-green-500 bg-green-500 text-white' :
                      'border-muted-foreground text-muted-foreground'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className={`ml-2 font-medium ${
                      isActive ? 'text-primary' :
                      isCompleted ? 'text-green-600' :
                      'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep !== 'confirmation' && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 'review'}
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </Button>
              
              {currentStep === 'payment' ? (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!isStepValid(currentStep) || isProcessing}
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                  {!isProcessing && <ArrowRight size={16} className="ml-2" />}
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepValid(currentStep)}
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;