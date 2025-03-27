
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "../components/transitions/PageTransition";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { Container } from "@/components/ui/container";

// Cart Components
import CartTable from "@/components/cart/CartTable";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import CheckoutForm, { CheckoutFormValues } from "@/components/cart/CheckoutForm";
import OrderSuccess from "@/components/cart/OrderSuccess";

const CartContent = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

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
    
    // Show success toast with order number
    toast.success(`Pesanan #${orderId.substring(0, 8)} berhasil dibuat!`, {
      description: "Terima kasih telah berbelanja di toko kami",
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 5000,
    });
    
    // Close checkout dialog after a short delay
    setTimeout(() => {
      setIsCheckoutOpen(false);
      // Reset success state after dialog closes
      setTimeout(() => {
        setOrderSuccess(false);
        setOrderNumber(null);
      }, 500);
    }, 3000);
  };

  const onSubmitCheckout = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      // Check if cart is empty
      if (items.length === 0) {
        throw new Error("Keranjang belanja kosong");
      }
      
      // Check if user ID exists and log it
      if (!user?.id) {
        console.error("Checkout failed: User ID not found");
        throw new Error("User ID tidak ditemukan");
      }
      
      console.log('Processing checkout for user:', user.id);
      console.log('User profile:', profile);
      console.log('Items to process:', items);
      console.log('Shipping details:', data);
      
      // Create an array to store the results
      const results = [];
      
      // Process each item individually
      for (const item of items) {
        console.log(`Processing item ${item.id}, quantity: ${item.quantity}`);
        
        // Create the transaction data with explicit user_id
        const transactionData = {
          user_id: user.id,
          product_id: item.id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          status: "Menunggu Pembayaran"
        };
        
        console.log("Transaction data to insert:", transactionData);
        
        // Insert transaction with proper user_id field
        const { data: insertedData, error } = await supabase
          .from("transactions")
          .insert(transactionData)
          .select('id')
          .single();
        
        if (error) {
          console.error("Error inserting transaction:", error);
          throw new Error(`Gagal memproses item: ${item.name}. Error: ${error.message}`);
        }
        
        console.log(`Successfully processed item ${item.id}, transaction ID: ${insertedData?.id}`);
        results.push(insertedData);
      }
      
      // Get the first transaction ID to use as the order number
      const firstOrderId = results[0]?.id || 'unknown';
      
      // Handle successful order
      handleOrderSuccess(firstOrderId);
      
    } catch (error: any) {
      console.error("Error processing checkout:", error);
      setIsProcessing(false);
      
      // Show specific error message
      toast.error(
        error.message || "Terjadi kesalahan saat memproses pesanan",
        {
          description: "Silakan coba lagi atau hubungi customer service",
          duration: 5000,
        }
      );
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
      
      {/* Checkout Dialog */}
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

const Cart = () => {
  return (
    <ProtectedRoute>
      <PageTransition>
        <Navbar />
        <CartContent />
      </PageTransition>
    </ProtectedRoute>
  );
};

export default Cart;
