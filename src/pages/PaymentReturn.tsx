import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle, Clock, XCircle, ShoppingBag, Home } from 'lucide-react';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useCart();
  const [status] = useState(searchParams.get('status') || 'pending');
  const orderNumber = searchParams.get('order_number') || '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={state.totalItems} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center space-y-6">
          {status === 'completed' || status === 'paid' ? (
            <>
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your payment has been confirmed. Your order is now being processed.
              </p>
            </>
          ) : status === 'failed' ? (
            <>
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={40} className="text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
              <p className="text-muted-foreground">
                Your payment could not be processed. Please try again or choose a different payment method.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock size={40} className="text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-yellow-600">Payment Pending</h1>
              <p className="text-muted-foreground">
                Your payment is being processed. You'll receive a notification once it's confirmed.
              </p>
            </>
          )}

          {orderNumber && (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-xl font-bold">{orderNumber}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ShoppingBag size={16} className="mr-2" />
              View Orders
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home size={16} className="mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentReturn;
