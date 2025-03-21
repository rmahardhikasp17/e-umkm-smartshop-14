
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const features = [
    {
      icon: <ShoppingBag size={24} />,
      title: "Produk Lokal",
      description: "Berbagai produk UMKM berkualitas tinggi dari seluruh Indonesia"
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Analisis AI",
      description: "Dapatkan insight bisnis berdasarkan analisis AI canggih"
    },
    {
      icon: <Award size={24} />,
      title: "Produk Asli",
      description: "Produk dijamin asli dari pengrajin dan produsen lokal"
    }
  ];

  return (
    <section className="pt-24 pb-16 md:pb-20 lg:pt-32 lg:pb-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              className="space-y-4 md:space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                custom={0}
                variants={fadeIn}
              >
                Platform E-Commerce Berbasis AI untuk UMKM
              </motion.div>
              
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
                custom={1}
                variants={fadeIn}
              >
                Kembangkan Bisnis UMKM Anda dengan Teknologi AI
              </motion.h1>
              
              <motion.p
                className="text-lg text-muted-foreground max-w-[600px]"
                custom={2}
                variants={fadeIn}
              >
                E-UMKM membantu para pelaku UMKM memasarkan produknya secara online dengan dukungan teknologi kecerdasan buatan untuk mengoptimalkan penjualan.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3"
                custom={3}
                variants={fadeIn}
              >
                <Button 
                  size="lg" 
                  className="rounded-full"
                  asChild
                >
                  <Link to="/products">
                    Jelajahi Produk
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  asChild
                >
                  <Link to="/admin">
                    Dashboard UMKM
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3,
              duration: 0.5,
              ease: "easeOut"
            }}
            className="relative aspect-video md:aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="UMKM Products"
              className="object-cover w-full h-full rounded-2xl"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm backdrop-saturate-150 rounded-xl p-4 shadow-elegant">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-lg p-2.5">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI-Powered Growth</h3>
                  <p className="text-sm text-muted-foreground">Tingkatkan penjualan dengan rekomendasi AI</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-subtle hover:shadow-elegant-hover transition-shadow duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.5
                  }
                }
              }}
            >
              <div className="bg-primary/10 rounded-lg p-3 inline-block mb-4">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
