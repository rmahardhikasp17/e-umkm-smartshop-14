
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { items } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
      const { data: { url }, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          items,
          email: user?.email || '',
        },
      });

      if (error) throw error;
      if (!url) throw new Error('No checkout URL received');

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
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
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? "Memproses..." : "Checkout"}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClearCart}
          disabled={isProcessing}
        >
          Kosongkan Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
