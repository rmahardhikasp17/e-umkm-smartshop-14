
import React from "react";
import { AlertCircle } from "lucide-react";
import { formatPrice } from "@/utils/data";

interface CheckoutPriceProps {
  totalPrice: number;
}

const CheckoutPrice: React.FC<CheckoutPriceProps> = ({ totalPrice }) => {
  return (
    <div className="flex items-center p-3 rounded-md bg-primary/10 mb-4">
      <AlertCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
      <p className="text-sm">
        Total pembayaran: <strong>{formatPrice(totalPrice)}</strong>
      </p>
    </div>
  );
};

export default CheckoutPrice;
