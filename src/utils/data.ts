
// This file now mainly contains utility functions. 
// The product data is now fetched from Supabase.

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

// Dummy products for fallback or initial state
export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Kopi Arabika Gayo",
    price: 120000,
    description: "Kopi arabika premium dari dataran tinggi Gayo, Aceh dengan cita rasa fruity dan aroma yang khas.",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan & Minuman",
    stock: 25,
    rating: 4.8
  },
  {
    id: "2",
    name: "Batik Tulis Pekalongan",
    price: 850000,
    description: "Batik tulis premium khas Pekalongan dengan motif pesisiran yang indah. Dibuat dengan pewarna alami.",
    image: "https://images.unsplash.com/photo-1568379783411-ece8c36c4c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 10,
    rating: 4.9
  },
  {
    id: "3",
    name: "Gelang Etnik Bali",
    price: 75000,
    description: "Gelang tangan etnik khas Bali terbuat dari perak dengan ukiran tradisional yang detail.",
    image: "https://images.unsplash.com/photo-1642022143889-ee52ba363e01?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Aksesoris",
    stock: 30,
    rating: 4.5
  },
  {
    id: "4",
    name: "Tas Rotan Lombok",
    price: 325000,
    description: "Tas rotan buatan tangan dari pengrajin Lombok. Desain boho-chic yang cocok untuk musim panas.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Aksesoris",
    stock: 15,
    rating: 4.7
  },
  {
    id: "5",
    name: "Teh Herbal Rosella",
    price: 45000,
    description: "Teh herbal dari bunga rosella organik. Kaya antioksidan dan memiliki rasa asam segar yang khas.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b02c51c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan & Minuman",
    stock: 40,
    rating: 4.6
  },
  {
    id: "6",
    name: "Ukiran Kayu Jepara",
    price: 1250000,
    description: "Ukiran dinding dari kayu jati dengan motif tradisional Jepara yang rumit dan detail.",
    image: "https://images.unsplash.com/photo-1605048548011-0bde96e5efb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Kerajinan",
    stock: 5,
    rating: 4.9
  },
  {
    id: "7",
    name: "Madu Hutan Sumbawa",
    price: 180000,
    description: "Madu hutan murni dari Sumbawa dengan rasa kaya dan aroma bunga liar yang khas.",
    image: "https://images.unsplash.com/photo-1589827577276-8c35997656c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan & Minuman",
    stock: 20,
    rating: 4.8
  },
  {
    id: "8",
    name: "Sandal Tenun Etnik",
    price: 95000,
    description: "Sandal dengan strap tenun tradisional dan sol yang nyaman. Cocok untuk casual wear.",
    image: "https://images.unsplash.com/photo-1543163677-37f7fa995ab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 25,
    rating: 4.4
  }
];

export const categories = [
  { name: "Semua", value: "all" },
  { name: "Makanan & Minuman", value: "Makanan & Minuman" },
  { name: "Fashion", value: "Fashion" },
  { name: "Aksesoris", value: "Aksesoris" },
  { name: "Kerajinan", value: "Kerajinan" }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
