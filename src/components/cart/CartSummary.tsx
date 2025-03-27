
import React from "react";
import { formatPrice } from "@/utils/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <Button className="w-full" onClick={onCheckout}>
          Checkout
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClearCart}
        >
          Kosongkan Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
