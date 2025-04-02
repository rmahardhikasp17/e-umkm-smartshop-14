
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/utils/data";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronLeft, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/transitions/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Define the product type based on Supabase schema
interface SupabaseProduct {
  product_id: string; 
  name: string;
  price: number;
  stock: number;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  category?: string;
  rating?: number;
}

// Frontend product type for the cart
interface CartProduct {
  id: string; // Keep as id since CartContext uses this format
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  // Fetch the specific product from Supabase
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("product_id", productId)
        .limit(1);

      if (error) throw error;
      return data as SupabaseProduct[];
    },
  });

  // Transform for consistent usage in the component
  const product = products && products.length > 0 ? 
    {
      id: products[0].product_id, // Map product_id to id for frontend use
      name: products[0].name,
      price: products[0].price,
      description: products[0].description || "",
      image: products[0].image_url || "/placeholder.svg",
      stock: products[0].stock,
      rating: products[0].rating || 4.5,
      category: products[0].category || "Uncategorized"
    } : null;

  // Handler for adding to cart
  const handleAddToCart = () => {
    if (product) {
      // Create a product object that matches what is expected by the addToCart function
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        stock: product.stock,
        rating: product.rating
      }, quantity);
      
      toast.success(`${product.name} ditambahkan ke keranjang`);
    }
  };

  // Handler for quantity changes
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link to="/products" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              <span>Kembali ke Produk</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="pt-4">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">
            Terjadi kesalahan saat memuat produk. Silakan coba lagi nanti.
          </p>
          <Button asChild>
            <Link to="/products">Kembali ke Produk</Link>
          </Button>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">
            Produk yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button asChild>
            <Link to="/products">Lihat Produk Lainnya</Link>
          </Button>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link to="/products" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            <span>Kembali ke Produk</span>
          </Link>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl overflow-hidden shadow-subtle"
          >
            <img 
              src={product?.image} 
              alt={product?.name} 
              className="w-full h-auto object-cover aspect-square"
            />
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-2xl md:text-3xl font-bold">{product?.name}</h1>
            
            <div className="flex items-center">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={`${
                      product && star <= Math.floor(product.rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    } mr-0.5`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product?.rating.toFixed(1)} / 5.0
              </span>
            </div>
            
            <p className="text-2xl font-bold text-primary">
              {product && formatPrice(product.price)}
            </p>
            
            <div className="border-t border-b py-4">
              <p className="text-muted-foreground whitespace-pre-line">
                {product?.description}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Kategori:</span>
              <span className="text-sm text-muted-foreground">{product?.category}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Stok:</span>
              <span className={`text-sm ${product && product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product ? product.stock > 0 ? `${product.stock} tersedia` : 'Habis' : ''}
              </span>
            </div>
            
            {/* Quantity Selector */}
            <div className="pt-4">
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium mr-4">Jumlah:</span>
                <div className="flex items-center border rounded-md">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-1 border-x text-center min-w-[40px]">
                    {quantity}
                  </span>
                  <button 
                    onClick={incrementQuantity}
                    disabled={product ? product.stock <= quantity : true}
                    className="px-3 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                disabled={!product || product.stock <= 0}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product ? product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis' : 'Memuat...'}
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Detail Produk</h2>
          <div className="bg-white p-6 rounded-xl shadow-subtle">
            <p className="text-muted-foreground whitespace-pre-line">
              {product?.description || "Tidak ada deskripsi detail untuk produk ini."}
            </p>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Produk Terkait</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-subtle animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default ProductDetail;
