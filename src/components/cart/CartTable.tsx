
import React from "react";
import { Product } from "@/components/ProductCard";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CartItem from "./CartItem";

interface CartTableProps {
  items: (Product & { quantity: number })[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartTable: React.FC<CartTableProps> = ({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity 
}) => {
  return (
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
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile View for Cart Items */}
      <div className="md:hidden">
        {items.map((item) => (
          <CartItem 
            key={item.id} 
            item={item} 
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
            isMobile
          />
        ))}
      </div>
    </div>
  );
};

export default CartTable;
