
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Container } from "@/components/ui/container";
import CartTable from "./CartTable";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import CheckoutForm from "./CheckoutForm";
import { type CheckoutFormValues } from "./schemas/checkoutSchema";
import OrderSuccess from "./OrderSuccess";
import { useCartOperations } from "@/hooks/useCartOperations";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const CartLayout = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const { isProcessing, processCheckout } = useCartOperations();

  const onCheckout = () => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu untuk melanjutkan checkout");
      navigate("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderId: string) => {
    setOrderSuccess(true);
    setOrderNumber(orderId);
    clearCart();
    
    toast.success(`Pesanan #${orderId.substring(0, 8)} berhasil dibuat!`, {
      description: "Terima kasih telah berbelanja di toko kami",
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 5000,
    });
    
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setTimeout(() => {
        setOrderSuccess(false);
        setOrderNumber(null);
      }, 500);
    }, 3000);
  };

  const onSubmitCheckout = async (data: CheckoutFormValues) => {
    const result = await processCheckout(items, user, data);
    if (result.success && result.orderId) {
      handleOrderSuccess(result.orderId);
    }
  };

  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Keranjang Belanja</h1>
      
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-x-auto">
            <CartTable 
              items={items} 
              onRemoveItem={removeFromCart} 
              onUpdateQuantity={updateQuantity}
            />
          </div>
          
          <div>
            <CartSummary
              totalPrice={totalPrice}
              onCheckout={onCheckout}
              onClearCart={clearCart}
            />
          </div>
        </div>
      )}
      
      <Dialog open={isCheckoutOpen} onOpenChange={(open) => !isProcessing && setIsCheckoutOpen(open)}>
        <DialogContent className="max-w-md sm:max-w-lg">
          {orderSuccess ? (
            <OrderSuccess orderNumber={orderNumber} onClose={() => setIsCheckoutOpen(false)} />
          ) : (
            <CheckoutForm
              defaultEmail={user?.email || ""}
              totalPrice={totalPrice}
              isProcessing={isProcessing}
              onCancel={() => setIsCheckoutOpen(false)}
              onSubmit={onSubmitCheckout}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CartLayout;
