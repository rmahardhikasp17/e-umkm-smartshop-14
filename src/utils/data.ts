
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

export const products: Product[] = [
  {
    id: "1",
    name: "Kopi Arabika Gayo",
    price: 85000,
    description: "Kopi arabika premium dari Pegunungan Gayo, Aceh. Memiliki cita rasa khas dengan tingkat keasaman seimbang, aroma fruity, dan sentuhan rasa coklat.",
    image: "https://images.unsplash.com/photo-1635208430486-19602a252a93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan & Minuman",
    stock: 25,
    rating: 4.8
  },
  {
    id: "2",
    name: "Tenun Songket Palembang",
    price: 1250000,
    description: "Kain tenun songket tradisional Palembang dengan motif klasik dan benang emas asli. Cocok untuk acara formal dan koleksi kain nusantara.",
    image: "https://images.unsplash.com/photo-1584285418938-fbd236ee7072?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 8,
    rating: 4.9
  },
  {
    id: "3",
    name: "Tas Rotan Bali",
    price: 275000,
    description: "Tas rotan handmade asli Bali dengan desain modern. Tas ringan dan cocok untuk gaya casual maupun formal.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Aksesoris",
    stock: 15,
    rating: 4.7
  },
  {
    id: "4",
    name: "Batik Tulis Pekalongan",
    price: 550000,
    description: "Batik tulis premium asal Pekalongan dengan pewarna alami. Memiliki motif unik yang diproduksi terbatas.",
    image: "https://images.unsplash.com/photo-1534445860924-b8707986313c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Fashion",
    stock: 10,
    rating: 4.9
  },
  {
    id: "5",
    name: "Madu Kelulut Kalimantan",
    price: 120000,
    description: "Madu murni dari lebah kelulut (stingless bee) asli hutan Kalimantan. Dikenal memiliki rasa khas dan khasiat kesehatan tinggi.",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan & Minuman",
    stock: 30,
    rating: 4.8
  },
  {
    id: "6",
    name: "Gerabah Lombok",
    price: 175000,
    description: "Kerajinan gerabah tradisional dari Lombok dengan motif klasik. Cocok untuk dekorasi rumah dan koleksi seni.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Kerajinan",
    stock: 12,
    rating: 4.6
  },
  {
    id: "7",
    name: "Kue Lapis Legit Palembang",
    price: 95000,
    description: "Kue lapis legit premium khas Palembang dengan resep turun temurun. Dibuat dengan bahan berkualitas dan tanpa pengawet.",
    image: "https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan & Minuman",
    stock: 20,
    rating: 4.8
  },
  {
    id: "8",
    name: "Kalung Perak Bali",
    price: 450000,
    description: "Kalung perak handmade asli Bali dengan ukiran tradisional. Dibuat oleh perajin terbaik dengan teknik turun temurun.",
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Aksesoris",
    stock: 8,
    rating: 4.7
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
