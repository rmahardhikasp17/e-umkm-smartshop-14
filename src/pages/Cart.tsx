
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/auth";
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

  // Validate product stock availability
  const validateProduct = async (productId: string, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock, price")
        .eq("id", productId)
        .single();
        
      if (error) {
        console.error("Error validating product:", error);
        return { valid: false, message: "Produk tidak ditemukan", product: null };
      }
      
      if (!data) {
        return { valid: false, message: "Produk tidak ditemukan", product: null };
      }
      
      if (data.stock < quantity) {
        return { 
          valid: false, 
          message: `Stok produk ${data.name} tidak mencukupi (tersedia: ${data.stock})`, 
          product: data 
        };
      }
      
      return { valid: true, message: "Produk tersedia", product: data };
    } catch (error) {
      console.error("Error in validateProduct:", error);
      return { valid: false, message: "Terjadi kesalahan saat validasi produk", product: null };
    }
  };

  // Create a new transaction with initial "Menunggu Pembayaran" status
  const createTransaction = async (
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number,
    shippingInfo: any
  ) => {
    try {
      // First validate the product availability again before creating the transaction
      const validation = await validateProduct(productId, quantity);
      if (!validation.valid) {
        return { success: false, id: null, error: new Error(validation.message) };
      }
      
      // Create the transaction within a single SQL operation
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          total_price: totalPrice,
          status: "Menunggu Pembayaran",
          shipping_info: shippingInfo
        })
        .select('id')
        .single();
        
      if (error) {
        console.error("Error creating transaction:", error);
        return { success: false, id: null, error };
      }
      
      // Update the product stock using the safe decrement function
      const { error: decrementError } = await supabase.rpc('decrement', {
        product_id: productId,
        quantity: quantity
      });
      
      if (decrementError) {
        console.error("Error decrementing stock:", decrementError);
        
        // If stock update fails, attempt to cancel the transaction
        await supabase
          .from("transactions")
          .update({ status: "Dibatalkan" })
          .eq("id", data.id);
          
        return { success: false, id: null, error: decrementError };
      }
      
      return { success: true, id: data.id, error: null };
    } catch (error) {
      console.error("Unexpected error creating transaction:", error);
      return { success: false, id: null, error };
    }
  };

  // Update transaction status with simpler implementation
  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      console.log(`Updating transaction ${transactionId} status to ${status}`);
      
      const { error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", transactionId);
        
      if (error) {
        console.error("Error updating transaction status:", error);
        return false;
      }
      
      console.log(`Successfully updated transaction ${transactionId} status to ${status}`);
      return true;
    } catch (error) {
      console.error("Unexpected error updating transaction status:", error);
      return false;
    }
  };

  const onSubmitCheckout = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      // Check if cart is empty
      if (items.length === 0) {
        throw new Error("Keranjang belanja kosong");
      }
      
      // Check if user ID exists
      if (!user?.id) {
        console.error("Checkout failed: User ID not found");
        throw new Error("User ID tidak ditemukan");
      }
      
      console.log('Processing checkout for user:', user.id);
      console.log('User profile:', profile);
      console.log('Items to process:', items);
      console.log('Shipping details:', data);
      
      // Create shipping info object
      const shippingInfo = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        payment_method: data.paymentMethod,
        notes: data.notes || null
      };
      
      // Validate all products first
      const invalidProducts = [];
      for (const item of items) {
        const validation = await validateProduct(item.id, item.quantity);
        if (!validation.valid) {
          invalidProducts.push({ 
            item, 
            message: validation.message 
          });
        }
      }
      
      // If any products are invalid, stop the checkout process
      if (invalidProducts.length > 0) {
        const messages = invalidProducts.map(p => p.message).join(", ");
        throw new Error(`Beberapa produk tidak dapat diproses: ${messages}`);
      }
      
      // Create transactions for each item
      const transactions = [];
      
      for (const item of items) {
        console.log(`Processing item ${item.id}, quantity: ${item.quantity}`);
        
        // Create transaction and update stock in a single operation
        const transactionResult = await createTransaction(
          user.id,
          item.id,
          item.quantity,
          item.price * item.quantity,
          shippingInfo
        );
        
        if (!transactionResult.success) {
          throw new Error(`Gagal membuat transaksi untuk ${item.name}`);
        }
        
        // Process payment (simulated)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update transaction status to "Dibayar"
        const statusUpdated = await updateTransactionStatus(transactionResult.id!, "Dibayar");
        
        if (!statusUpdated) {
          console.warn(`Failed to update transaction ${transactionResult.id} status to Dibayar`);
        } else {
          console.log(`Updated transaction ${transactionResult.id} status to Dibayar`);
        }
        
        transactions.push(transactionResult);
      }
      
      // Get the first transaction ID to use as the order number
      const firstOrderId = transactions[0]?.id || 'unknown';
      
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
    } finally {
      setIsProcessing(false);
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
