
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/transitions/PageTransition";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories, formatPrice } from "@/utils/data";
import { useCart } from "@/contexts/CartContext";

// Define the product type based on Supabase schema
interface Product {
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
const mapToProductFormat = (product: Product) => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description || "",
    image: product.image_url || "https://images.unsplash.com/photo-1635208430486-19602a252a93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", // Default image if none
    category: product.category || "Uncategorized",
    stock: product.stock,
    rating: product.rating || 4.5,
  };
};

const Products = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { totalItems } = useCart();

  // Fetch products from Supabase
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  // Apply filters and search
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under100k":
          filtered = filtered.filter((product) => product.price < 100000);
          break;
        case "100k-500k":
          filtered = filtered.filter(
            (product) => product.price >= 100000 && product.price <= 500000
          );
          break;
        case "500k-1m":
          filtered = filtered.filter(
            (product) => product.price > 500000 && product.price <= 1000000
          );
          break;
        case "above1m":
          filtered = filtered.filter((product) => product.price > 1000000);
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "stock-low":
        filtered.sort((a, b) => a.stock - b.stock);
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  // Define price ranges for filter
  const priceRanges = [
    { label: "Semua Harga", value: "all" },
    { label: "Di bawah Rp 100.000", value: "under100k" },
    { label: "Rp 100.000 - Rp 500.000", value: "100k-500k" },
    { label: "Rp 500.000 - Rp 1.000.000", value: "500k-1m" },
    { label: "Di atas Rp 1.000.000", value: "above1m" },
  ];

  // Define sort options
  const sortOptions = [
    { label: "Terbaru", value: "newest" },
    { label: "Harga Terendah", value: "price-low" },
    { label: "Harga Tertinggi", value: "price-high" },
    { label: "Stok Menipis", value: "stock-low" },
  ];

  return (
    <PageTransition>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="rounded-2xl bg-primary/10 py-10 px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Produk UMKM Terbaik
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Temukan produk-produk berkualitas dari UMKM lokal terbaik seluruh
              Indonesia.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="search"
                placeholder="Cari produk UMKM..."
                className="pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Filters and Sort */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all"
                ? "Semua Produk"
                : `Kategori: ${selectedCategory}`}
            </h2>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SlidersHorizontal size={16} className="mr-2" />
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative"
              >
                <a href="/cart">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </a>
              </Button>
            </div>
          </div>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Kategori
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Rentang Harga
                </label>
                <Select
                  value={priceRange}
                  onValueChange={setPriceRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Rentang Harga" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="text-sm font-medium mb-1 block">Pencarian</label>
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Cari produk..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Menampilkan {filteredProducts.length} produk</span>
            {searchTerm && (
              <span className="bg-secondary px-2 py-1 rounded-md">
                Pencarian: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="bg-secondary px-2 py-1 rounded-md">
                Kategori: {selectedCategory}
              </span>
            )}
            {priceRange !== "all" && (
              <span className="bg-secondary px-2 py-1 rounded-md">
                {priceRanges.find((range) => range.value === priceRange)?.label}
              </span>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="mb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">
                Terjadi kesalahan saat memuat produk. Silakan coba lagi nanti.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Tidak ada produk yang sesuai dengan filter yang dipilih.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                  setSortBy("newest");
                }}
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={mapToProductFormat(product)}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trending Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Produk Trending</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                ?.slice(0, 4)
                .map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={mapToProductFormat(product)}
                    index={index}
                  />
                ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Products;
