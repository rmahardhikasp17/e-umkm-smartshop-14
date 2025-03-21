
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Trash, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "../components/transitions/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/data";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Keranjang belanja Anda kosong");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call for processing order
    setTimeout(() => {
      toast.success("Pesanan berhasil dibuat! Mengarahkan ke halaman pembayaran...");
      clearCart();
      
      // In a real app, would redirect to checkout/payment page
      setTimeout(() => {
        setIsProcessing(false);
        window.location.href = "/";
      }, 1500);
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16 container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Keranjang Belanja</h1>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Lanjut Belanja</span>
              </Link>
            </div>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-background rounded-xl border"
              >
                <ShoppingCart
                  size={64}
                  className="mx-auto text-muted-foreground/50 mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">Keranjang Anda Kosong</h2>
                <p className="text-muted-foreground mb-6">
                  Sepertinya Anda belum menambahkan produk ke keranjang.
                </p>
                <Button asChild>
                  <Link to="/">Mulai Belanja</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white rounded-xl overflow-hidden shadow-subtle">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="font-medium">
                          Item dalam Keranjang ({items.length})
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={clearCart}
                        >
                          <Trash size={14} className="mr-1" />
                          Kosongkan
                        </Button>
                      </div>
                    </div>

                    <div className="divide-y">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 flex gap-4"
                        >
                          <div className="w-20 h-20 rounded-md overflow-hidden shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            
                            <div className="text-sm text-muted-foreground mb-2">
                              {formatPrice(item.price)}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border rounded overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 text-foreground hover:bg-secondary transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => 
                                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                                  }
                                  className="w-10 text-center border-0 focus:ring-0 text-sm py-1"
                                  min="1"
                                  max={item.stock}
                                />
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-foreground hover:bg-secondary transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-subtle p-4 sticky top-24">
                    <h2 className="font-medium mb-4">Ringkasan Pesanan</h2>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pengiriman</span>
                        <span>Dihitung saat checkout</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2 mb-4">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isProcessing || items.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2" size={16} />
                          Checkout
                        </>
                      )}
                    </Button>
                    
                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm flex">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 mr-2" />
                      <p>
                        Produk ini merupakan produk asli dari UMKM lokal. Dengan berbelanja, Anda mendukung pengrajin dan produsen lokal Indonesia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Cart;
