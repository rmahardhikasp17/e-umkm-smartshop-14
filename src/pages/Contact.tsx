
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Map, Mail, Phone, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  subject: z.string().min(5, { message: "Subjek minimal 5 karakter" }),
  message: z.string().min(10, { message: "Pesan minimal 10 karakter" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form submitted:", data);
      toast.success("Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Hubungi Kami
            </h1>
            <p className="text-lg text-muted-foreground">
              Ada pertanyaan atau ingin bekerjasama? Jangan ragu untuk menghubungi kami
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Informasi Kontak</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <a 
                          href="mailto:info@e-umkm.id" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          info@e-umkm.id
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Telepon</h3>
                        <a 
                          href="tel:+6282112345678" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          +62 821 1234 5678
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Map className="h-6 w-6 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Alamat</h3>
                        <p className="text-muted-foreground">
                          Jl. Digital UMKM No. 88, <br />
                          Jakarta Selatan, Indonesia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Jam Operasional</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Senin - Jumat</span>
                      <span className="text-muted-foreground">09:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sabtu</span>
                      <span className="text-muted-foreground">09:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Minggu</span>
                      <span className="text-muted-foreground">Tutup</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-medium flex items-center mb-2">
                      <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                      Respons Cepat
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Kami berkomitmen untuk merespons semua pertanyaan dalam waktu 24 jam pada hari kerja.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-semibold mb-6">Kirim Pesan</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nama lengkap Anda" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="email@anda.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subjek</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Subjek pesan Anda" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pesan</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tulis pesan Anda di sini..." 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-[400px] border">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2904144182747!2d106.82796857692044!3d-6.2297265613781985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e4799ae10f%3A0x34f7b0b1d539234b!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1699500000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;
