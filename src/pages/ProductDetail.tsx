
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, ArrowLeft, Minus, Plus, Calendar, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "../components/transitions/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Product, products, formatPrice } from "../utils/data";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    window.scrollTo(0, 0);

    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setQuantity(1);
        
        // Find related products from the same category
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (!product) return;
    
    if (value < 1) {
      toast.error("Jumlah minimum adalah 1");
      return;
    }
    
    if (value > product.stock) {
      toast.error(`Stok hanya tersedia ${product.stock}`);
      return;
    }
    
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      // Navigate to cart page
      window.location.href = "/cart";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
            <div className="space-y-4">
              <div className="h-7 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 container px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Maaf, produk yang Anda cari tidak ditemukan.
          </p>
          <Button asChild>
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16 container px-4 md:px-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Kembali</span>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                {product.category}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      } mr-0.5`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} ({Math.floor(product.rating * 10)} ulasan)
                </span>
              </div>
              
              <div className="text-2xl font-bold text-foreground mb-4">
                {formatPrice(product.price)}
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-green-50 text-green-700 text-sm font-medium rounded-full px-2.5 py-0.5 flex items-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-green-600 mr-1"></span>
                    Tersedia
                  </div>
                  <div className="text-sm text-muted-foreground ml-3">
                    Stok: {product.stock}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Truck size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Pengiriman 2-3 hari kerja
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <div className="flex items-center border rounded-lg overflow-hidden mr-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-12 text-center border-0 focus:ring-0"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Subtotal: {formatPrice(product.price * quantity)}
                </span>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2" size={18} />
                  Tambah ke Keranjang
                </Button>
                <Button 
                  className="flex-1"
                  size="lg"
                  onClick={handleBuyNow}
                >
                  <ShoppingBag className="mr-2" size={18} />
                  Beli Sekarang
                </Button>
              </div>
              
              <div className="mt-8">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${
                      activeTab === "description"
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Deskripsi
                  </button>
                  <button
                    onClick={() => setActiveTab("shipping")}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${
                      activeTab === "shipping"
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Pengiriman
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-2 px-4 font-medium text-sm transition-colors ${
                      activeTab === "reviews"
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Ulasan
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="py-4"
                  >
                    {activeTab === "description" && (
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p>{product.description}</p>
                        <p className="mt-4">
                          Produk UMKM asli Indonesia dengan kualitas terbaik. Mendukung pengrajin dan produsen lokal.
                        </p>
                      </div>
                    )}
                    
                    {activeTab === "shipping" && (
                      <div className="text-sm text-muted-foreground">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Truck size={16} className="mr-2" />
                            <p>Pengiriman ke seluruh Indonesia melalui JNE, SiCepat, dan AnterAja</p>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            <p>Estimasi pengiriman 2-3 hari kerja, tergantung lokasi</p>
                          </div>
                          <p className="mt-3">
                            Biaya pengiriman dihitung berdasarkan berat dan lokasi pengiriman. Biaya akan ditampilkan saat checkout.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === "reviews" && (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="border-b pb-4 last:border-0">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2 text-xs">
                                {index === 0 && "BP"}
                                {index === 1 && "SM"}
                                {index === 2 && "RD"}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">
                                  {index === 0 && "Budi Pratama"}
                                  {index === 1 && "Siti Maryam"}
                                  {index === 2 && "Rini Dwiyanti"}
                                </h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={`${
                                        i < (index === 0 ? 5 : index === 1 ? 4 : 5)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300 fill-gray-300"
                                      } mr-0.5`}
                                    />
                                  ))}
                                  <span className="text-xs text-muted-foreground ml-1">
                                    {index === 0 && "1 bulan yang lalu"}
                                    {index === 1 && "2 minggu yang lalu"}
                                    {index === 2 && "3 hari yang lalu"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {index === 0 && "Kualitas produk sangat bagus, sesuai dengan deskripsi. Pengiriman juga cepat. Sangat puas dengan pembelian ini."}
                              {index === 1 && "Barang sudah diterima dalam kondisi baik. Kualitas lumayan bagus untuk harganya. Pengiriman agak lama tapi tidak masalah."}
                              {index === 2 && "Barang bagus, pengemasan rapi, pengiriman cepat. Puas sekali belanja di sini. Pasti akan kembali lagi untuk berbelanja."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
