
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <Container className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tentang E-UMKM
            </h1>
            <p className="text-lg text-muted-foreground">
              Platform e-commerce yang membantu UMKM Indonesia berkembang di era digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Visi Kami</h2>
              <p className="text-muted-foreground mb-4">
                Menjadi platform terdepan yang memberdayakan Usaha Mikro, Kecil, dan Menengah (UMKM) 
                di Indonesia untuk berkembang di era digital melalui teknologi e-commerce yang inovatif 
                dan inklusif.
              </p>
              <p className="text-muted-foreground">
                Kami percaya bahwa UMKM adalah tulang punggung ekonomi Indonesia, dan melalui 
                digitalisasi, mereka dapat menjangkau pasar yang lebih luas dan bersaing secara global.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Misi Kami</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Menyediakan platform e-commerce yang mudah digunakan dan diakses oleh semua UMKM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Mengintegrasikan teknologi AI untuk membantu UMKM mengoptimalkan bisnisnya</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Memfasilitasi pertumbuhan UMKM melalui pelatihan digital dan akses ke pasar yang lebih luas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Menciptakan ekosistem digital yang berkelanjutan untuk UMKM Indonesia</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center mb-8">Cerita Kami</h2>
            <div className="space-y-6 text-muted-foreground">
              <p>
                E-UMKM lahir dari keprihatinan melihat banyak usaha kecil dan menengah yang kesulitan
                beradaptasi dengan era digital. Di tengah pandemi COVID-19 yang memaksa banyak bisnis
                untuk tutup, kami melihat ada kebutuhan mendesak untuk membantu UMKM bertransformasi secara digital.
              </p>
              <p>
                Didirikan pada tahun 2023, E-UMKM telah berkembang dari sebuah ide sederhana menjadi
                platform e-commerce komprehensif yang melayani ribuan UMKM di seluruh Indonesia. Kami
                tidak hanya menyediakan tempat untuk berjualan, tetapi juga alat analisis berbasis AI,
                pelatihan digital, dan jaringan komunitas yang kuat.
              </p>
              <p>
                Kami percaya bahwa teknologi harus dapat diakses oleh semua orang, tidak peduli besar
                kecilnya usaha. Setiap fitur yang kami kembangkan dirancang dengan mempertimbangkan
                kebutuhan spesifik UMKM Indonesia, mulai dari pedagang makanan tradisional hingga
                pengrajin seni kontemporer.
              </p>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-semibold text-center mb-8">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-background p-6 rounded-md shadow-sm">
                <h3 className="font-semibold text-xl mb-2">Inklusivitas</h3>
                <p className="text-muted-foreground">Kami membangun platform yang dapat diakses dan bermanfaat bagi semua UMKM.</p>
              </div>
              <div className="bg-background p-6 rounded-md shadow-sm">
                <h3 className="font-semibold text-xl mb-2">Inovasi</h3>
                <p className="text-muted-foreground">Kami terus mengembangkan solusi teknologi terbaru untuk mendukung UMKM.</p>
              </div>
              <div className="bg-background p-6 rounded-md shadow-sm">
                <h3 className="font-semibold text-xl mb-2">Keberlanjutan</h3>
                <p className="text-muted-foreground">Kami mendorong praktik bisnis yang bertanggung jawab dan berkelanjutan.</p>
              </div>
              <div className="bg-background p-6 rounded-md shadow-sm">
                <h3 className="font-semibold text-xl mb-2">Pemberdayaan</h3>
                <p className="text-muted-foreground">Kami memberikan alat dan pengetahuan untuk membantu UMKM tumbuh mandiri.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-center mb-8">Tim Kami</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-secondary mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300" 
                    alt="Sari Indah" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">Sari Indah</h3>
                <p className="text-primary">CEO & Founder</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Memiliki pengalaman 10+ tahun dalam pengembangan UMKM dan teknologi.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-secondary mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300" 
                    alt="Budi Santoso" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">Budi Santoso</h3>
                <p className="text-primary">CTO</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Spesialis AI dan pengembangan platform dengan fokus pada UX.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-secondary mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300&h=300" 
                    alt="Maya Putri" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">Maya Putri</h3>
                <p className="text-primary">Head of UMKM Relations</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Membina hubungan dengan UMKM dan komunitas bisnis lokal.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
      <Footer />
    </>
  );
};

export default About;
