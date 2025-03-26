
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Package, 
  TrendingUp, 
  UserCircle,
  LogOut, 
  Search,
  Plus,
  Bot
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PageTransition from "../components/transitions/PageTransition";
import Dashboard from "../components/admin/Dashboard";
import Products from "../components/admin/Products";
import Orders from "../components/admin/Orders";
import Customers from "../components/admin/Customers";
import AITools from "../components/admin/AITools";

const Admin = () => {
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil keluar dari panel admin");
    navigate("/");
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      case "ai-tools":
        return <AITools />;
      default:
        return <Dashboard />;
    }
  };
  
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
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex items-center text-sm px-3 py-2 rounded-md w-full text-left ${
                      activeTab === "dashboard" 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-secondary transition-colors"
                    }`}
                  >
                    <BarChart3 size={18} className="mr-2" />
                    <span>Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`flex items-center text-sm px-3 py-2 rounded-md w-full text-left ${
                      activeTab === "products" 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-secondary transition-colors"
                    }`}
                  >
                    <Package size={18} className="mr-2" />
                    <span>Produk</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`flex items-center text-sm px-3 py-2 rounded-md w-full text-left ${
                      activeTab === "orders" 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-secondary transition-colors"
                    }`}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    <span>Pesanan</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("customers")}
                    className={`flex items-center text-sm px-3 py-2 rounded-md w-full text-left ${
                      activeTab === "customers" 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-secondary transition-colors"
                    }`}
                  >
                    <Users size={18} className="mr-2" />
                    <span>Pelanggan</span>
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground px-3 py-2">AI TOOLS</h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("ai-tools")}
                    className={`flex items-center text-sm px-3 py-2 rounded-md w-full text-left ${
                      activeTab === "ai-tools" 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-secondary transition-colors"
                    }`}
                  >
                    <Bot size={18} className="mr-2" />
                    <span>AI Tools</span>
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                  >
                    <TrendingUp size={18} className="mr-2" />
                    <span>Coming Soon</span>
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
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm px-3 py-2 rounded-md w-full text-left text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Keluar</span>
                  </button>
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
                {activeTab === "products" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden md:flex"
                    onClick={() => {
                      setActiveTab("products");
                      // Trigger add product dialog through a global event
                      document.dispatchEvent(new Event("open-add-product"));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Produk Baru
                  </Button>
                )}
                
                <div className="flex items-center ml-2">
                  <div className="flex flex-col items-end mr-3">
                    <span className="text-sm font-medium">{profile?.full_name || "Admin"}</span>
                    <span className="text-xs text-muted-foreground">{profile?.role || "Admin UMKM"}</span>
                  </div>
                  <UserCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Admin;
