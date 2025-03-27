
import React from "react";
import { formatPrice } from "@/utils/data";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Product } from "@/components/ProductCard";

interface CartItemProps {
  item: Product & { quantity: number };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  isMobile?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  isMobile = false 
}) => {
  if (isMobile) {
    return (
      <div className="p-4 border-b last:border-0">
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
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr>
      <td className="p-4">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded" 
        />
      </td>
      <td className="p-4 font-medium">{item.name}</td>
      <td className="p-4">{formatPrice(item.price)}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <td className="p-4">{formatPrice(item.price * item.quantity)}</td>
      <td className="p-4 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;
