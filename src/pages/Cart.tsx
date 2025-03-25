
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/data";
import { Trash2, ShoppingBag, AlertCircle, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "../components/transitions/PageTransition";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

// Checkout form schema
const checkoutFormSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CartContent = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      address: "",
      paymentMethod: "",
      notes: "",
    },
  });

  // Update form when user changes
  React.useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user, form]);

  const onCheckout = () => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu untuk melanjutkan checkout");
      navigate("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const onSubmitCheckout = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      // Log transaction data for debugging
      console.log('User ID:', user?.id);
      console.log('Items to process:', items);
      
      if (!user?.id) {
        throw new Error("User ID is missing");
      }
      
      // Create transaction promises
      const transactionPromises = items.map(item => {
        return supabase
          .from("transactions")
          .insert({
            user_id: user.id,
            product_id: item.id,
            quantity: item.quantity,
            total_price: item.price * item.quantity,
            status: "Menunggu Pembayaran"
          });
      });
      
      // Wait for all transactions to complete
      const results = await Promise.all(transactionPromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error("Transaction errors:", errors);
        throw new Error(`Failed to process ${errors.length} items`);
      }

      // Success
      toast.success("Pesanan berhasil dibuat!");
      setIsCheckoutOpen(false);
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Keranjang Belanja</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-secondary/30 rounded-lg">
          <ShoppingBag className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg md:text-xl font-medium mb-2">Keranjang Belanja Kosong</h2>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            Anda belum menambahkan produk ke keranjang belanja
          </p>
          <Link to="/products">
            <Button>
              Lihat Produk
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-x-auto">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Produk</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded" 
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{formatPrice(item.price)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile View for Cart Items */}
              <div className="md:hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-4 border-b last:border-0">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded" 
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{formatPrice(item.price)}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 border rounded-md p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="mr-2 font-medium">{formatPrice(item.price * item.quantity)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
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
                  onClick={clearCart}
                >
                  Kosongkan Keranjang
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      
      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Checkout Pesanan</DialogTitle>
            <DialogDescription>
              Masukkan informasi pengiriman dan pembayaran
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCheckout)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="081234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Alamat Pengiriman</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-24" placeholder="Masukkan alamat lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Metode Pembayaran</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode pembayaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                          <SelectItem value="e_wallet">E-Wallet</SelectItem>
                          <SelectItem value="cod">Bayar di Tempat (COD)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Catatan (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tambahkan catatan untuk pesanan Anda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex items-center p-3 rounded-md bg-primary/10 mb-4">
                <AlertCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Total pembayaran: <strong>{formatPrice(totalPrice)}</strong>
                </p>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} className="w-full sm:w-auto">
                  Batal
                </Button>
                <Button type="submit" disabled={isProcessing} className="w-full sm:w-auto">
                  {isProcessing ? "Memproses..." : "Konfirmasi Pesanan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
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
