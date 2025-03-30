
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { formatPrice } from "@/utils/data";

// Checkout form schema
const checkoutFormSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  defaultEmail: string;
  totalPrice: number;
  isProcessing: boolean;
  onCancel: () => void;
  onSubmit: (data: CheckoutFormValues) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  defaultEmail,
  totalPrice,
  isProcessing,
  onCancel,
  onSubmit
}) => {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: defaultEmail || "",
      phone: "",
      address: "",
      paymentMethod: "",
      notes: "",
    },
  });

  // Add debug log to verify the email is correctly passed
  console.log("Checkout form initialized with email:", defaultEmail);

  const handleFormSubmit = (data: CheckoutFormValues) => {
    // Log the form data before submission to verify values
    console.log("Submitting checkout form with data:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
        
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="w-full sm:w-auto"
            disabled={isProcessing}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={isProcessing} 
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                Memproses...
              </span>
            ) : (
              "Konfirmasi Pesanan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
