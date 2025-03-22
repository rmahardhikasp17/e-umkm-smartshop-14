
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
