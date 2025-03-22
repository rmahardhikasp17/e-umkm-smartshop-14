
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Wand2, TrendingUp, DollarSign, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AITools = () => {
  const [productInput, setProductInput] = useState("");
  const [priceInput, setpriceInput] = useState("");
  const [trendInput, setTrendInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleAIRequest = (type: string, prompt: string) => {
    setIsGenerating(true);
    setAiResult(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
      
      let result = "";
      
      switch (type) {
        case "product":
          result = generateProductDescription(prompt);
          break;
        case "trend":
          result = generateTrendAnalysis(prompt);
          break;
        case "price":
          result = generatePriceRecommendation(prompt);
          break;
        default:
          result = "Invalid AI tool type";
      }
      
      setAiResult(result);
      toast.success(`${type === "product" ? "Deskripsi produk" : type === "trend" ? "Analisis tren" : "Rekomendasi harga"} berhasil dibuat`);
    }, 1500);
  };

  // Simulated product description generator
  const generateProductDescription = (productName: string) => {
    const adjectives = [
      "premium", "berkualitas tinggi", "terbaik", "handmade", "autentik", 
      "eksklusif", "tradisional", "asli", "unik", "elegant"
    ];
    
    const features = [
      "dibuat dengan bahan terbaik", 
      "diproduksi oleh pengrajin terampil", 
      "menggunakan teknik tradisional", 
      "detail yang teliti",
      "desain yang timeless",
      "ketahanan yang luar biasa",
      "tampilan yang elegan",
      "kenyamanan yang optimal"
    ];
    
    const benefits = [
      "menjadi pilihan tepat untuk digunakan sehari-hari",
      "akan membuat Anda tampil lebih stylish",
      "memberikan kepuasan dan kenyamanan maksimal",
      "merupakan investasi jangka panjang untuk gaya hidup berkualitas",
      "akan menambahkan sentuhan elegance pada koleksi Anda",
      "menjadi solusi sempurna untuk kebutuhan Anda"
    ];
    
    const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const feature1 = features[Math.floor(Math.random() * features.length)];
    const feature2 = features[Math.floor(Math.random() * features.length)];
    const benefit = benefits[Math.floor(Math.random() * benefits.length)];
    
    return `${productName} ${adj1} kami adalah pilihan ${adj2} untuk Anda yang menghargai kualitas dan keunikan. Produk ini ${feature1} dan ${feature2}, sehingga ${benefit}. Setiap detail dirancang dengan mempertimbangkan kebutuhan pelanggan, memberikan pengalaman terbaik dalam setiap penggunaan.
    
Keunggulan ${productName} kami:
• Menggunakan bahan berkualitas tinggi
• Proses produksi yang teliti dan terstandar
• Desain yang fungsional dan estetis
• Ketahanan yang teruji
• Garansi kualitas dari produsen lokal terpercaya

Dapatkan ${productName} sekarang dan rasakan perbedaannya!`;
  };

  // Simulated trend analysis generator
  const generateTrendAnalysis = (category: string) => {
    const trends = [
      `Berdasarkan analisis data penjualan dalam 3 bulan terakhir, kami melihat peningkatan minat konsumen sebesar 23% untuk produk ${category}.`,
      `Produk ${category} dengan desain minimalis dan warna netral menjadi favorit, dengan peningkatan penjualan hingga 28% dibanding periode sebelumnya.`,
      `85% pelanggan yang membeli ${category} cenderung kembali untuk pembelian kedua dalam waktu 2 bulan.`,
      `Produk ${category} yang dilengkapi fitur ramah lingkungan mendapatkan ulasan positif 32% lebih tinggi dan tingkat retur yang lebih rendah.`,
      `Kami melihat potensi cross-selling yang baik antara ${category} dengan aksesoris pelengkap, dengan 42% pembeli menambahkan item terkait ke keranjang belanja mereka.`
    ];
    
    return `# Analisis Tren Pasar: ${category}

${trends.join('\n\n')}

## Rekomendasi Strategi

1. **Fokus pada pengembangan lini produk** ${category} dengan desain minimalis dan nilai ramah lingkungan
2. **Implementasikan bundling produk** dengan aksesoris pelengkap untuk meningkatkan nilai pembelian rata-rata
3. **Tingkatkan komunikasi pascapenjualan** pada hari ke-45 setelah pembelian untuk mendorong pembelian kedua
4. **Eksplorasi variasi produk** dengan warna netral dan elemen desain lokal

Analisis ini didasarkan pada data penjualan terkini dan perilaku konsumen. Untuk mendapatkan hasil maksimal, kami sarankan untuk memperbarui strategi pemasaran sesuai dengan rekomendasi di atas.`;
  };

  // Simulated price recommendation generator
  const generatePriceRecommendation = (productName: string) => {
    const basePrice = Math.floor(Math.random() * 100000) + 50000;
    const premiumPrice = Math.floor(basePrice * 1.3);
    const economyPrice = Math.floor(basePrice * 0.85);
    
    const competitorA = Math.floor(basePrice * (0.9 + Math.random() * 0.2));
    const competitorB = Math.floor(basePrice * (0.85 + Math.random() * 0.3));
    
    const margin = Math.floor((basePrice - (basePrice * 0.6)) / basePrice * 100);
    const volumeIncrease = Math.floor(Math.random() * 20) + 15;
    const marginDecrease = Math.floor(Math.random() * 5) + 3;
    
    return `# Rekomendasi Strategi Harga: ${productName}

Berdasarkan analisis pasar dan posisi kompetitif, kami merekomendasikan struktur harga berikut:

## Strategi Harga Optimal

| Strategi | Harga | Margin | Keunggulan |
|----------|-------|--------|------------|
| **Premium** | Rp ${premiumPrice.toLocaleString('id-ID')} | ${margin + 8}% | Positioning kualitas tinggi |  
| **Standar** | Rp ${basePrice.toLocaleString('id-ID')} | ${margin}% | Keseimbangan nilai & margin |
| **Ekonomis** | Rp ${economyPrice.toLocaleString('id-ID')} | ${margin - 5}% | Volume penjualan tinggi |

## Perbandingan Kompetitor

- Kompetitor A: Rp ${competitorA.toLocaleString('id-ID')}
- Kompetitor B: Rp ${competitorB.toLocaleString('id-ID')}

## Rekomendasi Utama

Kami merekomendasikan **strategi harga Standar** di Rp ${basePrice.toLocaleString('id-ID')} yang akan:
1. Mempertahankan margin profit yang sehat (${margin}%)
2. Menawarkan nilai kompetitif dibanding pesaing
3. Memberikan ruang untuk promosi dan diskon berkala

Jika ingin meningkatkan volume penjualan, harga Ekonomis dapat meningkatkan volume hingga ${volumeIncrease}% dengan pengurangan margin sebesar ${marginDecrease}%.

*Rekomendasi ini berdasarkan analisis pasar terkini dan dapat diperbarui sesuai perkembangan.*`;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Tools</h1>
        <p className="text-muted-foreground">Gunakan kekuatan AI untuk mengoptimalkan bisnis UMKM Anda</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="product">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Product Generator</span>
            </TabsTrigger>
            <TabsTrigger value="trend" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analisis Tren</span>
            </TabsTrigger>
            <TabsTrigger value="price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Smart Pricing</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="product">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  <span>Product Generator</span>
                </CardTitle>
                <CardDescription>
                  Buat deskripsi produk menarik dengan bantuan AI untuk meningkatkan konversi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Nama Produk
                    </label>
                    <Input 
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      placeholder="Mis. Batik Tulis Pekalongan"
                    />
                  </div>
                  
                  {aiResult && (
                    <div className="mt-6">
                      <label className="text-sm font-medium block mb-1.5">
                        Hasil Deskripsi AI
                      </label>
                      <div className="p-4 bg-secondary/30 rounded-md whitespace-pre-line">
                        {aiResult}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => handleAIRequest("product", productInput)}
                  disabled={!productInput || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Buat Deskripsi</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Analisis Tren</span>
                </CardTitle>
                <CardDescription>
                  Dapatkan insight tentang tren pasar untuk kategori produk tertentu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Kategori Produk
                    </label>
                    <Input 
                      value={trendInput}
                      onChange={(e) => setTrendInput(e.target.value)}
                      placeholder="Mis. Kerajinan Tangan"
                    />
                  </div>
                  
                  {aiResult && (
                    <div className="mt-6">
                      <label className="text-sm font-medium block mb-1.5">
                        Hasil Analisis Tren
                      </label>
                      <div className="p-4 bg-secondary/30 rounded-md whitespace-pre-line">
                        {aiResult}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => handleAIRequest("trend", trendInput)}
                  disabled={!trendInput || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      <span>Analisis Tren</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="price">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Smart Pricing</span>
                </CardTitle>
                <CardDescription>
                  Dapatkan rekomendasi harga optimal untuk produk Anda berdasarkan analisis pasar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Nama Produk
                    </label>
                    <Input 
                      value={priceInput}
                      onChange={(e) => setpriceInput(e.target.value)}
                      placeholder="Mis. Tas Rotan Bali"
                    />
                  </div>
                  
                  {aiResult && (
                    <div className="mt-6">
                      <label className="text-sm font-medium block mb-1.5">
                        Rekomendasi Harga
                      </label>
                      <div className="p-4 bg-secondary/30 rounded-md whitespace-pre-line">
                        {aiResult}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => handleAIRequest("price", priceInput)}
                  disabled={!priceInput || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>Calculating...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Hitung Harga Optimal</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default AITools;
