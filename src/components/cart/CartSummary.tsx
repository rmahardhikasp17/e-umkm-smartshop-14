
import React, { useState } from "react";
import { formatPrice } from "@/utils/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CartSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  totalPrice, 
  onCheckout, 
  onClearCart 
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { items } = useCart();
  const { user } = useAuth();

  const handleStripeCheckout = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Prepare shipping info for Stripe
      const shippingInfo = {
        email: user?.email || '',
        name: user?.email?.split('@')[0] || 'Guest',
      };
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image_url
          })),
          email: user?.email || '',
          shippingInfo
        },
      });

      if (error) throw new Error(error.message);
      
      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Ringkasan Pesanan</CardTitle>
        <CardDescription>
          Periksa pesanan Anda sebelum checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pengiriman</span>
          <span>Gratis</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleStripeCheckout}
          disabled={isProcessingPayment || items.length === 0}
        >
          {isProcessingPayment ? "Memproses..." : "Bayar dengan Stripe"}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClearCart}
          disabled={isProcessingPayment || items.length === 0}
        >
          Kosongkan Keranjang
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={onCheckout}
          disabled={isProcessingPayment || items.length === 0}
        >
          Checkout Reguler
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
