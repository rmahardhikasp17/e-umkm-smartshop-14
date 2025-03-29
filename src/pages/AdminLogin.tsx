import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Mail, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/transitions/PageTransition";
import Navbar from "@/components/Navbar";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const { signIn, session, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirected, setRedirected] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session && profile && !isLoading && !redirected) {
      if (profile.role === 'admin') {
        console.log("Admin detected, redirecting to admin dashboard");
        setRedirected(true);
        navigate("/admin");
      } else {
        toast.error("Akses ditolak", {
          description: "Anda tidak memiliki akses ke panel admin",
        });
        setRedirected(true);
        navigate("/");
      }
    }
  }, [session, profile, isLoading, navigate, redirected]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Attempting admin login with email:", data.email);
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error("Admin login failed:", error);
        toast.error("Login gagal", {
          description: error.message || "Periksa email dan password Anda",
        });
        return;
      }
      
      console.log("Admin login successful, waiting for profile data");
    } catch (error: any) {
      console.error("Error during admin login:", error);
      toast.error("Terjadi kesalahan", {
        description: error.message || "Silakan coba lagi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (session && profile && profile.role === 'admin' && !redirected) {
    return <Navigate to="/admin" />;
  }

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
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial admin Anda untuk akses panel admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    "Masuk ke Panel Admin"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              <a href="/create-admin" className="text-primary hover:underline">
                Buat akun admin baru
              </a>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              Kembali ke{" "}
              <a href="/" className="text-primary hover:underline">
                beranda
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
