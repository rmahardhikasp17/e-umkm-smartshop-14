import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Mail, LockKeyhole, User } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/transitions/PageTransition";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/auth";

const adminSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
});

type AdminFormValues = z.infer<typeof adminSchema>;

const CreateAdmin = () => {
  const { isAdmin, session } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: AdminFormValues) => {
    setIsLoading(true);
    try {
      // Call the Supabase Edge Function to create an admin account
      console.log("Calling make-admin function with data:", { email: data.email, full_name: data.fullName });
      
      const { data: responseData, error } = await supabase.functions.invoke('make-admin', {
        body: {
          email: data.email,
          password: data.password,
          full_name: data.fullName,
        },
      });

      if (error) {
        console.error("Error invoking make-admin function:", error);
        throw new Error(error.message || "Gagal membuat akun admin");
      }

      console.log("Admin creation response:", responseData);
      
      toast.success("Akun admin berhasil dibuat!", {
        description: `Admin dengan email ${data.email} telah berhasil dibuat.`
      });
      
      form.reset();
      
      // Optional: Navigate to admin login page after successful creation
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error creating admin account:", error);
      toast.error("Gagal membuat akun admin", {
        description: error.message || "Terjadi kesalahan saat membuat akun admin"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only allow admins to create other admin accounts
  // Comment this out temporarily if you need to create the first admin
  // if (!isAdmin && session) {
  //   return <Navigate to="/" />;
  // }

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
              Form ini untuk membuat akun admin baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Nama Lengkap Admin" className="pl-10" {...field} />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                      Memproses...
                    </span>
                  ) : "Buat Akun Admin"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Kembali ke{" "}
              <a href="/admin-login" className="text-primary hover:underline">
                login admin
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default CreateAdmin;
