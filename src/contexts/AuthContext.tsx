
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Session, User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
}

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Retrieved existing session:", session ? "Yes" : "No");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Using RPC function instead of direct table query to avoid type issues
      const { data, error } = await supabase.rpc('get_profile_by_id', {
        user_id: userId
      });

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else if (data) {
        console.log("Profile retrieved:", data);
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role,
          full_name: data.full_name
        };
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
      setProfile(null);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast.error(error.message || "Login gagal. Silakan periksa email dan password Anda.");
        return { error };
      }

      if (data.user) {
        console.log("User signed in successfully:", data.user.id);
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (error: any) {
      console.error("Exception during sign in:", error);
      toast.error("Terjadi kesalahan saat login");
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Signing up new user:", email);
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
        console.error("Sign up error:", error.message);
        toast.error(error.message || "Registrasi gagal. Silakan coba lagi.");
        return { error };
      }

      toast.success("Berhasil mendaftar! Silahkan cek email Anda untuk verifikasi.");
      return { error: null };
    } catch (error: any) {
      console.error("Exception during sign up:", error);
      toast.error("Terjadi kesalahan saat registrasi");
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      toast.info("Berhasil keluar");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Terjadi kesalahan saat logout");
    }
  };

  // Check if user is admin
  const isAdmin = profile?.role === "admin";

  const value = {
    user,
    profile,
    session,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
