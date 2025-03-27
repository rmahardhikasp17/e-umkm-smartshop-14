
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyCart: React.FC = () => {
  return (
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
  );
};

export default EmptyCart;
