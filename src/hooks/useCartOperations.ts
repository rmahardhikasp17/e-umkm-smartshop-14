import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type CheckoutFormValues } from "@/components/cart/schemas/checkoutSchema";

export const useCartOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const validateProduct = async (productId: string, quantity: number) => {
    try {
      console.log(`Validating product ${productId} with quantity ${quantity}`);
      
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        console.error("Invalid product ID format:", productId);
        return { 
          valid: false, 
          message: "ID produk tidak valid", 
          product: null 
        };
      }
      
      const { data, error } = await supabase
        .from("products")
        .select("product_id, name, stock, price")
        .eq("product_id", productId)
        .single();
        
      if (error) {
        console.error("Error validating product:", error);
        return { 
          valid: false, 
          message: `Gagal memvalidasi produk: ${error.message}`, 
          product: null 
        };
      }
      
      if (!data) {
        console.error("Product not found:", productId);
        return { 
          valid: false, 
          message: "Produk tidak ditemukan", 
          product: null 
        };
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
      console.error("Unexpected error in validateProduct:", error);
      return { 
        valid: false, 
        message: "Terjadi kesalahan saat validasi produk", 
        product: null 
      };
    }
  };

  const createTransaction = async (
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number,
    shippingInfo: any
  ) => {
    try {
      const validation = await validateProduct(productId, quantity);
      if (!validation.valid) {
        return { success: false, id: null, error: new Error(validation.message) };
      }
      
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
        .select('transaction_id')
        .single();
        
      if (error) {
        return { success: false, id: null, error };
      }
      
      const { error: decrementError } = await supabase.rpc('decrement', {
        product_id: productId,
        quantity: quantity
      });
      
      if (decrementError) {
        await supabase
          .from("transactions")
          .update({ status: "Dibatalkan" })
          .eq("transaction_id", data.transaction_id);
          
        return { success: false, id: null, error: decrementError };
      }
      
      return { success: true, id: data.transaction_id, error: null };
    } catch (error) {
      return { success: false, id: null, error };
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("transaction_id", transactionId);
        
      if (error) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const processCheckout = async (items: any[], user: any, data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      if (items.length === 0) {
        throw new Error("Keranjang belanja kosong");
      }
      
      if (!user?.id) {
        throw new Error("User ID tidak ditemukan");
      }
      
      const shippingInfo = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        payment_method: data.paymentMethod,
        notes: data.notes || null
      };
      
      const invalidProducts = [];
      for (const item of items) {
        if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
          invalidProducts.push({ 
            item, 
            message: `ID produk ${item.name} tidak valid` 
          });
          continue;
        }
        
        const validation = await validateProduct(item.id, item.quantity);
        if (!validation.valid) {
          invalidProducts.push({ 
            item, 
            message: validation.message 
          });
        }
      }
      
      if (invalidProducts.length > 0) {
        const messages = invalidProducts.map(p => p.message).join(", ");
        throw new Error(`Beberapa produk tidak dapat diproses: ${messages}`);
      }
      
      const transactions = [];
      
      for (const item of items) {
        const transactionResult = await createTransaction(
          user.id,
          item.id,
          item.quantity,
          item.price * item.quantity,
          shippingInfo
        );
        
        if (!transactionResult.success) {
          throw new Error(`Gagal membuat transaksi untuk ${item.name}: ${transactionResult.error?.message || 'Unknown error'}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const statusUpdated = await updateTransactionStatus(transactionResult.id!, "Dibayar");
        
        if (!statusUpdated) {
          console.warn(`Failed to update transaction ${transactionResult.id} status to Dibayar`);
        }
        
        transactions.push(transactionResult);
      }
      
      const firstOrderId = transactions[0]?.id || 'unknown';
      return { success: true, orderId: firstOrderId };
      
    } catch (error: any) {
      console.error("Error processing checkout:", error);
      toast.error(
        error.message || "Terjadi kesalahan saat memproses pesanan",
        {
          description: "Silakan coba lagi atau hubungi customer service",
          duration: 5000,
        }
      );
      return { success: false, orderId: null };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processCheckout,
  };
};
