
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Package, 
  CreditCard, 
  TrendingUp, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  UserCircle,
  LogOut, 
  Search,
  Plus,
  Bot
} from "lucide-react";
import { Input } from "@/components/ui/input";
import PageTransition from "../components/transitions/PageTransition";
import { formatPrice } from "../utils/data";

const Admin = () => {
  const [activeSidebar, setActiveSidebar] = useState(true);
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary/50 flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: activeSidebar ? 0 : -280 }}
          className="fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm overflow-y-auto"
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-primary">E-UMKM</h1>
              <span className="text-xs font-medium bg-primary/10 text-primary rounded-md px-2 py-0.5 ml-2">
                Admin
              </span>
            </Link>
          </div>
          
          <nav className="p-2">
            <div className="mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground px-3 py-2">MENU</h2>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
                  >
                    <BarChart3 size={18} className="mr-2" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <Package size={18} className="mr-2" />
                    <span>Produk</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    <span>Pesanan</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <Users size={18} className="mr-2" />
                    <span>Pelanggan</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground px-3 py-2">AI TOOLS</h2>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <Bot size={18} className="mr-2" />
                    <span>Product Generator</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <TrendingUp size={18} className="mr-2" />
                    <span>Analisis Tren</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <DollarSign size={18} className="mr-2" />
                    <span>Smart Pricing</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground px-3 py-2">LAINNYA</h2>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <Settings size={18} className="mr-2" />
                    <span>Pengaturan</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Keluar</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </motion.aside>

        {/* Content */}
        <div className="flex-1 max-w-full overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b sticky top-0 z-30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveSidebar(!activeSidebar)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <div className="relative hidden md:flex items-center ml-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari..."
                    className="pl-8 bg-secondary border-0 focus-visible:ring-0 text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Plus className="h-4 w-4 mr-1" />
                  Produk Baru
                </Button>
                
                <div className="flex items-center ml-2">
                  <div className="flex flex-col items-end mr-3">
                    <span className="text-sm font-medium">Budi Santoso</span>
                    <span className="text-xs text-muted-foreground">Admin UMKM</span>
                  </div>
                  <UserCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Selamat datang kembali, Budi Santoso</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  title: "Total Penjualan",
                  value: formatPrice(7500000),
                  change: "+12.5%",
                  positive: true,
                  icon: <DollarSign className="h-5 w-5 text-white" />
                },
                {
                  title: "Total Pesanan",
                  value: "42",
                  change: "+6.8%",
                  positive: true,
                  icon: <ShoppingBag className="h-5 w-5 text-white" />
                },
                {
                  title: "Produk Terjual",
                  value: "128",
                  change: "+24.3%",
                  positive: true,
                  icon: <Package className="h-5 w-5 text-white" />
                },
                {
                  title: "Pelanggan Baru",
                  value: "18",
                  change: "-2.7%",
                  positive: false,
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
                      <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                    </div>
                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-purple-500' : 'bg-orange-500'}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium flex items-center ${card.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {card.positive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                      {card.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1.5">vs bulan lalu</span>
                  </div>
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
                {[
                  {
                    title: "Stok Produk",
                    description: "Kopi Arabika Gayo perlu segera di-restock dalam 5 hari",
                    action: "Restock Sekarang"
                  },
                  {
                    title: "Optimasi Harga",
                    description: "Naikkan harga Batik Tulis 10% untuk meningkatkan margin profit",
                    action: "Lihat Analisis"
                  },
                  {
                    title: "Tren Produk",
                    description: "Tas Rotan Bali mendapat kenaikan minat pembeli sebesar 25%",
                    action: "Lihat Tren"
                  },
                ].map((insight, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {insight.action}
                    </Button>
                  </div>
                ))}
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
                    {[
                      {
                        id: "ORD-0012",
                        customer: "Rini Setiawati",
                        product: "Kopi Arabika Gayo",
                        total: formatPrice(85000),
                        status: "Dikirim",
                        statusColor: "bg-green-500",
                        date: "2 jam lalu"
                      },
                      {
                        id: "ORD-0011",
                        customer: "Ahmad Fadli",
                        product: "Batik Tulis Pekalongan",
                        total: formatPrice(550000),
                        status: "Dikemas",
                        statusColor: "bg-blue-500",
                        date: "5 jam lalu"
                      },
                      {
                        id: "ORD-0010",
                        customer: "Dewi Lestari",
                        product: "Tas Rotan Bali",
                        total: formatPrice(275000),
                        status: "Selesai",
                        statusColor: "bg-green-700",
                        date: "1 hari lalu"
                      },
                      {
                        id: "ORD-0009",
                        customer: "Budi Santoso",
                        product: "Gerabah Lombok",
                        total: formatPrice(175000),
                        status: "Selesai",
                        statusColor: "bg-green-700",
                        date: "2 hari lalu"
                      },
                      {
                        id: "ORD-0008",
                        customer: "Siti Nurhaliza",
                        product: "Madu Kelulut Kalimantan",
                        total: formatPrice(120000),
                        status: "Dibatalkan",
                        statusColor: "bg-red-500",
                        date: "3 hari lalu"
                      }
                    ].map((order, index) => (
                      <tr key={index} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                        <td className="py-3 px-4 text-sm">{order.customer}</td>
                        <td className="py-3 px-4 text-sm">{order.product}</td>
                        <td className="py-3 px-4 text-sm">{order.total}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Admin;
