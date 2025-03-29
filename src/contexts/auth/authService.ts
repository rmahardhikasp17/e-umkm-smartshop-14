
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Sign in with email and password - improved error handling
export const signIn = async (email: string, password: string) => {
  try {
    console.log("Attempting sign in for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      toast.error(error.message);
      return { error };
    }

    if (data.user) {
      console.log("Sign in successful");
      toast.success("Berhasil masuk!");
    }

    return { error: null };
  } catch (error) {
    console.error("Exception during sign in:", error);
    toast.error("Terjadi kesalahan saat login");
    return { error };
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    toast.success("Berhasil mendaftar! Silahkan cek email Anda untuk verifikasi.");
    return { error: null };
  } catch (error) {
    toast.error("Terjadi kesalahan saat registrasi");
    return { error };
  }
};

// Enhanced sign out that properly clears the session
export const signOut = async () => {
  try {
    console.log("Signing out user");
    await supabase.auth.signOut();
    toast.info("Berhasil keluar");
    return { error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("Terjadi kesalahan saat logout");
    return { error };
  }
};
