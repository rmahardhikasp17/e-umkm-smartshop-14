
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../utils/data";
import { toast } from "sonner";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextProps {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      localStorage.removeItem("cart");
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
      
      // Calculate totals
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setTotalItems(itemCount);
      setTotalPrice(price);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Check if adding more would exceed stock
        if (existingItem.quantity + quantity > product.stock) {
          toast.error(`Hanya tersedia ${product.stock} stok`);
          return prevItems;
        }
        
        // Item exists, update quantity
        const updatedItems = prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        toast.success(`${product.name} ditambahkan ke keranjang`);
        return updatedItems;
      } else {
        // Check if adding would exceed stock
        if (quantity > product.stock) {
          toast.error(`Hanya tersedia ${product.stock} stok`);
          return prevItems;
        }
        
        // Item doesn't exist, add new item
        toast.success(`${product.name} ditambahkan ke keranjang`);
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      const updatedItems = prevItems.filter(item => item.id !== productId);
      
      if (item) {
        toast.info(`${item.name} dihapus dari keranjang`);
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems => {
      const product = prevItems.find(item => item.id === productId);
      
      if (!product) return prevItems;
      
      // Ensure quantity doesn't exceed stock or go below 1
      const validQuantity = Math.max(1, Math.min(quantity, product.stock));
      
      if (validQuantity !== quantity) {
        if (validQuantity === product.stock) {
          toast.error(`Hanya tersedia ${product.stock} stok`);
        }
      }
      
      return prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: validQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Keranjang belanja telah dikosongkan");
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
