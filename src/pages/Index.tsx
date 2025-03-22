
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "../components/transitions/PageTransition";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { dummyProducts, categories, Product } from "../utils/data";

// Interface for Supabase product data
interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  category?: string;
  rating?: number;
}

// Convert Supabase product to our frontend product format
const mapToProductFormat = (product: SupabaseProduct): Product => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description || "",
    image: product.image_url || "https://images.unsplash.com/photo-1635208430486-19602a252a93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: product.category || "Uncategorized",
    stock: product.stock,
    rating: product.rating || 4.5,
  };
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Fetch products from Supabase
  const { data: supabaseProducts, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SupabaseProduct[];
    },
  });

  // Use supabase products or fallback to dummy data
  const products = supabaseProducts?.map(mapToProductFormat) || dummyProducts;
  
  const featuredProducts = products.slice(0, 4);
  const bestSellerProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  
  const filteredProducts = 
    selectedCategory === "all" 
      ? bestSellerProducts 
      : bestSellerProducts.filter(product => product.category === selectedCategory);

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          
          {/* Featured Products */}
          <section className="py-16 bg-secondary/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Produk Unggulan</h2>
                  <p className="text-muted-foreground mt-1">Produk pilihan dari UMKM terbaik di Indonesia</p>
                </div>
                <Link to="/products">
                  <Button variant="ghost" className="mt-3 md:mt-0 group">
                    Lihat Semua
                    <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  // Show loading skeleton 
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  featuredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="py-16">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Kata Pelanggan Kami</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Dengar apa yang dikatakan pelanggan tentang pengalaman berbelanja di E-UMKM
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: item * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-subtle hover:shadow-elegant-hover transition-all duration-300"
                  >
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={18} 
                          className="text-yellow-400 fill-yellow-400 mr-0.5" 
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {item === 1 && "Saya sangat senang berbelanja di E-UMKM. Produk yang dijual sangat berkualitas dan proses pengirimannya cepat. Saya juga suka bahwa platform ini mendukung UMKM lokal."}
                      {item === 2 && "Platform yang luar biasa untuk menemukan produk UMKM berkualitas. Saya menemukan kain batik tulis yang indah dengan harga yang sangat terjangkau. Pasti akan berbelanja lagi!"}
                      {item === 3 && "Sebagai pencinta produk lokal, E-UMKM adalah surga bagi saya. Semua produk asli buatan pengrajin Indonesia dan kualitasnya luar biasa. Proses checkout juga sangat mudah."}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                        {item === 1 && "RS"}
                        {item === 2 && "DN"}
                        {item === 3 && "AM"}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {item === 1 && "Rina Setiawan"}
                          {item === 2 && "Dimas Nugroho"}
                          {item === 3 && "Anita Maharani"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item === 1 && "Jakarta"}
                          {item === 2 && "Yogyakarta"}
                          {item === 3 && "Bandung"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Best Seller Products */}
          <section className="py-16 bg-secondary/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Produk Terlaris</h2>
                  <p className="text-muted-foreground mt-1">Produk-produk terpopuler saat ini</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.value)}
                        className="rounded-full text-sm"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  // Show loading skeleton
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index} 
                    />
                  ))
                )}
              </div>
              
              <div className="text-center mt-10">
                <Button
                  size="lg"
                  className="rounded-full"
                  asChild
                >
                  <Link to="/products">
                    Jelajahi Semua Produk
                  </Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Join as UMKM */}
          <section className="py-16">
            <div className="container px-4 md:px-6">
              <div className="relative overflow-hidden rounded-2xl bg-primary text-white">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 mix-blend-multiply" />
                  <img
                    src="https://images.unsplash.com/photo-1634733988138-5e19e403f0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="UMKM Owner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative p-8 md:p-12 lg:p-16">
                  <div className="max-w-md">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl md:text-3xl font-bold mb-3"
                    >
                      Anda Pelaku UMKM?
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-white/80 mb-6"
                    >
                      Gabung dengan E-UMKM dan dapatkan akses ke dashboard berbasis AI untuk mengembangkan bisnis Anda dan menjangkau pelanggan lebih luas.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-full shadow-md"
                        asChild
                      >
                        <Link to="/admin">
                          Mulai Sekarang
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
