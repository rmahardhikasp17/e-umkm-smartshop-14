
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-primary">
              E-UMKM
            </Link>
            <p className="mt-3 text-muted-foreground">
              Platform e-commerce berbasis AI untuk membantu UMKM Indonesia berkembang di era digital.
            </p>
            <div className="flex space-x-4 mt-4">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Produk</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Fashion" className="text-muted-foreground hover:text-primary transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/products?category=Makanan & Minuman" className="text-muted-foreground hover:text-primary transition-colors">
                  Makanan & Minuman
                </Link>
              </li>
              <li>
                <Link to="/products?category=Kerajinan" className="text-muted-foreground hover:text-primary transition-colors">
                  Kerajinan
                </Link>
              </li>
              <li>
                <Link to="/products?category=Aksesoris" className="text-muted-foreground hover:text-primary transition-colors">
                  Aksesoris
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Layanan</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard UMKM
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Kelola Produk
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="text-muted-foreground hover:text-primary transition-colors">
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className="text-muted-foreground hover:text-primary transition-colors">
                  Analisis AI
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Kontak</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-muted-foreground" />
                <a href="mailto:info@e-umkm.id" className="text-muted-foreground hover:text-primary transition-colors">
                  info@e-umkm.id
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-muted-foreground" />
                <a href="tel:+6282112345678" className="text-muted-foreground hover:text-primary transition-colors">
                  +62 821 1234 5678
                </a>
              </li>
              <li className="flex space-x-2">
                <MapPin size={16} className="text-muted-foreground shrink-0 mt-1" />
                <span className="text-muted-foreground">
                  Jl. Digital UMKM No. 88, Jakarta Selatan, Indonesia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} E-UMKM. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Syarat & Ketentuan
            </Link>
            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
