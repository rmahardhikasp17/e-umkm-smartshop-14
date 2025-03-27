
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderSuccessProps {
  orderNumber: string | null;
  onClose: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderNumber, onClose }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Pesanan Berhasil!</h3>
      <p className="text-center text-muted-foreground mb-4">
        Pesanan dengan nomor <span className="font-medium">#{orderNumber?.substring(0, 8)}</span> telah berhasil dibuat
      </p>
      <p className="text-sm text-center text-muted-foreground mb-6">
        Kami akan memproses pesanan Anda secepatnya. Detail pesanan telah dikirim ke email Anda.
      </p>
      <Button 
        onClick={() => {
          onClose();
          navigate("/");
        }}
      >
        Kembali ke Beranda
      </Button>
    </div>
  );
};

export default OrderSuccess;
