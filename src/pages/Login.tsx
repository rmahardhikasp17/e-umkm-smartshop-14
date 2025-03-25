
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, LockKeyhole, Mail, Shield } from "lucide-react";
import PageTransition from "@/components/transitions/PageTransition";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  isAdmin: z.boolean().optional().default(false),
  adminCode: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, session, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAdminFields, setShowAdminFields] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdmin: false,
      adminCode: "",
    },
  });

  const isAdminField = form.watch("isAdmin");
  
  // Reset admin fields when toggling off
  useEffect(() => {
    if (!isAdminField) {
      form.setValue('adminCode', '');
      setAdminLoginError(null);
    }
  }, [isAdminField, form]);

  // Get the return path from location state or default to "/"
  const from = location.state?.from || "/";

  const onSubmit = async (data: LoginFormValues) => {
    setAdminLoginError(null);
    
    // Check if admin code is correct when trying to login as admin
    if (data.isAdmin) {
      const adminCode = data.adminCode?.trim();
      if (adminCode !== "ADMIN") {
        setAdminLoginError("Kode admin tidak valid");
        return;
      }
    }

    const { error } = await signIn(data.email, data.password);
    
    if (!error) {
      // Login successful
      toast.success("Login berhasil!");
      
      if (data.isAdmin) {
        // Check if user is actually an admin using the RPC function
        const { data: isAdminResult, error: adminCheckError } = await supabase.rpc('is_admin');
        
        if (adminCheckError) {
          console.error("Error checking admin status:", adminCheckError);
          toast.error("Tidak dapat memverifikasi status admin");
          return;
        }
        
        if (!isAdminResult) {
          toast.error("Anda tidak memiliki hak akses admin");
          return;
        }
        
        navigate("/admin");
      } else {
        navigate(from);
      }
    }
  };

  // Toggle admin fields visibility
  const toggleAdminFields = () => {
    setShowAdminFields(!showAdminFields);
    form.setValue("isAdmin", !showAdminFields);
    if (!showAdminFields) {
      form.setValue("adminCode", "");
    }
  };

  // Redirect if already logged in
  if (session && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="container py-12 md:py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Masuk Akun</CardTitle>
            <CardDescription className="text-center">
              Masukkan email dan password Anda untuk masuk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="email@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Password field */}
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
                
                {/* Hidden button to toggle admin fields */}
                <div className="flex items-center justify-between">
                  <div
                    className="text-xs text-muted-foreground cursor-default select-none"
                    onClick={toggleAdminFields}
                    style={{ userSelect: "none" }}
                  >
                    {showAdminFields ? "Login sebagai User" : "⠀"} {/* Invisible character */}
                  </div>
                  
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Lupa password?
                  </Link>
                </div>
                
                {/* Admin fields only shown when toggled */}
                {showAdminFields && (
                  <>
                    <FormField
                      control={form.control}
                      name="isAdmin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Login sebagai Admin</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Akses khusus untuk pengelola sistem
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  
                    {isAdminField && (
                      <FormField
                        control={form.control}
                        name="adminCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kode Admin</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Shield className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="Masukkan kode admin" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
                
                {/* Admin login error message */}
                {adminLoginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{adminLoginError}</AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Daftar disini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
