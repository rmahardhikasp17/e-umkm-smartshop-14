import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CheckoutFormValues } from "./schemas/checkoutSchema";

const CheckoutForm: React.FC<{ onSubmit: (data: CheckoutFormValues) => void; onCancel: () => void; isProcessing: boolean; }> = ({ onSubmit, onCancel, isProcessing }) => {
    const form = useForm<CheckoutFormValues>();

    const handleFormSubmit = (data: CheckoutFormValues) => {
        console.log("Submitting checkout form with data:", data);
        onSubmit(data);
    };

    return (
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Form Fields Here */}
            <Button type="button" onClick={onCancel} disabled={isProcessing}>Batal</Button>
            <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Memproses..." : "Konfirmasi Pesanan"}
            </Button>
        </form>
    );
};

export default CheckoutForm;