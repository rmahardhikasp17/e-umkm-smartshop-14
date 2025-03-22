
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, Package, Users, ArrowUp, ArrowDown, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/data";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Define transaction type based on Supabase table
type Product = {
  name: string;
  image_url: string | null;
  stock: number;
  price: number;
};

type User = {
  email: string;
};

type Transaction = {
  id: string;
  product_id: string | null;
  quantity: number;
  total_price: number;
  status: string;
  user_id: string | null;
  created_at: string | null;
  product?: Product;
  user?: User;
};

// Status colors mapping
const statusColors = {
  "Dikirim": "bg-green-500",
  "Dikemas": "bg-blue-500",
  "Selesai": "bg-green-700",
  "Dibatalkan": "bg-red-500",
  "Menunggu Pembayaran": "bg-yellow-500"
};

const Dashboard = () => {
  // Use React Query to fetch data
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['dashboard-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          product:products(name, image_url, stock, price),
          user:users(email)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw new Error("Failed to fetch transactions");
      }
      
      return data as Transaction[];
    }
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("stock", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
      
      return data as Product[];
    }
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
      
      return data;
    }
  });

  // Calculate dashboard statistics
  const calculateStatistics = () => {
    if (!transactions) return null;

    // Get current date and 30 days ago
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    const sixtyDaysAgo = new Date(currentDate);
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // Filter transactions for current and previous month
    const currentMonthTransactions = transactions.filter(transaction => 
      new Date(transaction.created_at as string) >= thirtyDaysAgo
    );
    const previousMonthTransactions = transactions.filter(transaction => 
      new Date(transaction.created_at as string) >= sixtyDaysAgo && 
      new Date(transaction.created_at as string) < thirtyDaysAgo
    );

    // Calculate statistics
    const totalSales = currentMonthTransactions
      .filter(t => t.status === "Selesai" || t.status === "Dikirim")
      .reduce((sum, t) => sum + t.total_price, 0);
    
    const previousMonthSales = previousMonthTransactions
      .filter(t => t.status === "Selesai" || t.status === "Dikirim")
      .reduce((sum, t) => sum + t.total_price, 0);
    
    const salesPercentChange = previousMonthSales === 0 
      ? 100 
      : ((totalSales - previousMonthSales) / previousMonthSales) * 100;

    const totalOrders = currentMonthTransactions.length;
    const previousMonthOrders = previousMonthTransactions.length;
    const ordersPercentChange = previousMonthOrders === 0 
      ? 100 
      : ((totalOrders - previousMonthOrders) / previousMonthOrders) * 100;

    const productsSold = currentMonthTransactions
      .filter(t => t.status === "Selesai" || t.status === "Dikirim")
      .reduce((sum, t) => sum + t.quantity, 0);
    
    const previousMonthProductsSold = previousMonthTransactions
      .filter(t => t.status === "Selesai" || t.status === "Dikirim")
      .reduce((sum, t) => sum + t.quantity, 0);
    
    const productsSoldPercentChange = previousMonthProductsSold === 0 
      ? 100 
      : ((productsSold - previousMonthProductsSold) / previousMonthProductsSold) * 100;

    // Calculate new customers (users with first transaction in last 30 days)
    const usersWithTransactions = new Set();
    const newCustomers = users ? 
      users.filter(user => {
        const firstTransaction = transactions.find(t => t.user_id === user.id);
        return firstTransaction && new Date(firstTransaction.created_at as string) >= thirtyDaysAgo;
      }).length : 0;
    
    const previousMonthNewCustomers = users ? 
      users.filter(user => {
        const firstTransaction = transactions.find(t => t.user_id === user.id);
        return firstTransaction && 
          new Date(firstTransaction.created_at as string) >= sixtyDaysAgo && 
          new Date(firstTransaction.created_at as string) < thirtyDaysAgo;
      }).length : 0;
    
    const newCustomersPercentChange = previousMonthNewCustomers === 0 
      ? 100 
      : ((newCustomers - previousMonthNewCustomers) / previousMonthNewCustomers) * 100;

    return {
      totalSales,
      salesPercentChange,
      totalOrders,
      ordersPercentChange,
      productsSold,
      productsSoldPercentChange,
      newCustomers,
      newCustomersPercentChange
    };
  };

  // Generate AI recommendations
  const generateRecommendations = () => {
    if (!products || !transactions) return null;

    // Low stock recommendation
    const lowStockProducts = products
      .filter(product => product.stock <= 5)
      .sort((a, b) => a.stock - b.stock);
    
    // Price optimization recommendation
    const productSales = {};
    transactions.forEach(t => {
      if (t.product && t.product_id) {
        if (!productSales[t.product_id]) {
          productSales[t.product_id] = {
            name: t.product.name,
            salesCount: 0,
            totalRevenue: 0,
            price: t.product.price
          };
        }
        productSales[t.product_id].salesCount += t.quantity;
        productSales[t.product_id].totalRevenue += t.total_price;
      }
    });

    // Find product with high sales but low profit margin (candidate for price increase)
    const priceOptimizationProduct = Object.values(productSales)
      .sort((a, b) => b.salesCount - a.salesCount)[0];

    // Popular products trending
    const recentTransactions = transactions
      .filter(t => {
        const transactionDate = new Date(t.created_at as string);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return transactionDate >= twoWeeksAgo;
      });

    const productTrends = {};
    recentTransactions.forEach(t => {
      if (t.product_id) {
        if (!productTrends[t.product_id]) {
          productTrends[t.product_id] = {
            name: t.product?.name || "Unknown Product",
            count: 0
          };
        }
        productTrends[t.product_id].count += t.quantity;
      }
    });

    const trendingProduct = Object.values(productTrends)
      .sort((a, b) => b.count - a.count)[0];

    return {
      stockRecommendation: lowStockProducts.length > 0 ? {
        title: "Stok Produk",
        description: `${lowStockProducts[0].name} perlu segera di-restock dalam ${lowStockProducts[0].stock} hari`,
        action: "Restock Sekarang"
      } : {
        title: "Stok Produk",
        description: "Semua produk memiliki stok yang cukup",
        action: "Cek Inventori"
      },
      priceRecommendation: priceOptimizationProduct ? {
        title: "Optimasi Harga",
        description: `Naikkan harga ${priceOptimizationProduct.name} 10% untuk meningkatkan margin profit`,
        action: "Lihat Analisis"
      } : {
        title: "Optimasi Harga",
        description: "Tidak ada rekomendasi optimasi harga saat ini",
        action: "Lihat Analisis"
      },
      trendRecommendation: trendingProduct ? {
        title: "Tren Produk",
        description: `${trendingProduct.name} mendapat kenaikan minat pembeli sebesar ${trendingProduct.count * 5}%`,
        action: "Lihat Tren"
      } : {
        title: "Tren Produk",
        description: "Tidak ada tren produk signifikan dalam 2 minggu terakhir",
        action: "Lihat Tren"
      }
    };
  };

  const stats = calculateStatistics();
  const recommendations = generateRecommendations();
  const latestTransactions = transactions ? transactions.slice(0, 5) : [];
  const isLoading = isLoadingTransactions || isLoadingProducts || isLoadingUsers;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang kembali, Budi Santoso</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Penjualan",
            value: isLoading ? null : formatPrice(stats?.totalSales || 0),
            change: isLoading ? null : `${stats?.salesPercentChange.toFixed(1)}%`,
            positive: isLoading ? true : (stats?.salesPercentChange || 0) >= 0,
            icon: <DollarSign className="h-5 w-5 text-white" />
          },
          {
            title: "Total Pesanan",
            value: isLoading ? null : `${stats?.totalOrders || 0}`,
            change: isLoading ? null : `${stats?.ordersPercentChange.toFixed(1)}%`,
            positive: isLoading ? true : (stats?.ordersPercentChange || 0) >= 0,
            icon: <ShoppingBag className="h-5 w-5 text-white" />
          },
          {
            title: "Produk Terjual",
            value: isLoading ? null : `${stats?.productsSold || 0}`,
            change: isLoading ? null : `${stats?.productsSoldPercentChange.toFixed(1)}%`,
            positive: isLoading ? true : (stats?.productsSoldPercentChange || 0) >= 0,
            icon: <Package className="h-5 w-5 text-white" />
          },
          {
            title: "Pelanggan Baru",
            value: isLoading ? null : `${stats?.newCustomers || 0}`,
            change: isLoading ? null : `${stats?.newCustomersPercentChange.toFixed(1)}%`,
            positive: isLoading ? true : (stats?.newCustomersPercentChange || 0) >= 0,
            icon: <Users className="h-5 w-5 text-white" />
          }
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-5 rounded-xl shadow-subtle"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                )}
              </div>
              <div className={`p-2 rounded-lg ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-purple-500' : 'bg-orange-500'}`}>
                {card.icon}
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <div className="flex items-center">
                <span className={`text-xs font-medium flex items-center ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.positive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                  {card.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">vs bulan lalu</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white p-5 rounded-xl shadow-subtle mb-6"
      >
        <div className="flex items-center mb-4">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Rekomendasi AI</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-full mt-3" />
              </div>
            ))
          ) : recommendations ? [
            recommendations.stockRecommendation,
            recommendations.priceRecommendation,
            recommendations.trendRecommendation
          ].map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium mb-1">{insight.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                {insight.action}
              </Button>
            </div>
          )) : null}
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-white rounded-xl shadow-subtle overflow-hidden"
      >
        <div className="p-5 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pesanan Terbaru</h2>
            <Button variant="ghost" size="sm">
              Lihat Semua
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">ID Pesanan</th>
                <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Pelanggan</th>
                <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Produk</th>
                <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Total</th>
                <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Status</th>
                <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))
              ) : latestTransactions.map((order, index) => {
                // Format transaction date
                const orderDate = order.created_at 
                  ? new Date(order.created_at)
                  : new Date();
                const now = new Date();
                
                const diffTime = Math.abs(now.getTime() - orderDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                
                let formattedDate = "";
                if (diffDays > 0) {
                  formattedDate = `${diffDays} hari lalu`;
                } else if (diffHours > 0) {
                  formattedDate = `${diffHours} jam lalu`;
                } else {
                  formattedDate = "Baru saja";
                }
                
                return (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{`ORD-${order.id.substring(0, 4)}`}</td>
                    <td className="py-3 px-4 text-sm">{order.user?.email || "Pelanggan"}</td>
                    <td className="py-3 px-4 text-sm">{order.product?.name || "Produk"}</td>
                    <td className="py-3 px-4 text-sm">{formatPrice(order.total_price)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusColors[order.status] || "bg-gray-500"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
