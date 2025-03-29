
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Shield, User, Mail, LockKeyhole } from "lucide-react";
import PageTransition from "@/components/transitions/PageTransition";
import Navbar from "@/components/Navbar";

const createAdminSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  full_name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

const CreateAdmin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
    },
  });

  const onSubmit = async (data: CreateAdminFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke("make-admin", {
        body: data,
      });
      
      if (error) {
        toast.error("Gagal membuat akun admin", {
          description: error.message,
        });
        return;
      }
      
      toast.success("Akun admin berhasil dibuat", {
        description: "Admin dapat login menggunakan email dan password yang telah didaftarkan",
      });
      
      // Reset form
      form.reset();
      
      // Redirect to admin login
      navigate("/admin-login");
    } catch (error: any) {
      toast.error("Terjadi kesalahan", {
        description: error.message || "Silakan coba lagi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="container py-12 md:py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Buat Akun Admin</CardTitle>
            <CardDescription className="text-center">
              Buat akun admin baru untuk mengelola sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Nama Admin" className="pl-10" {...field} />
                        </div>
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="admin@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="******" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                      Memproses...
                    </span>
                  ) : (
                    "Buat Akun Admin"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Sudah memiliki akun admin?{" "}
              <a href="/admin-login" className="text-primary hover:underline">
                Login sebagai admin
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default CreateAdmin;
