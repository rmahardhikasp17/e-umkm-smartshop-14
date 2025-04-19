
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { checkoutFormSchema, type CheckoutFormValues } from "./schemas/checkoutSchema";
import CheckoutFormFields from "./checkout/CheckoutFormFields";
import CheckoutPrice from "./checkout/CheckoutPrice";

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

  console.log("Checkout form initialized with email:", defaultEmail);

  const handleFormSubmit = (data: CheckoutFormValues) => {
    console.log("Submitting checkout form with data:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <CheckoutFormFields form={form} />
        <CheckoutPrice totalPrice={totalPrice} />
        
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
