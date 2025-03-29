
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

  // Initialize auth state with improved loading indicators
  useEffect(() => {
    console.log("Setting up auth state management...");
    
    // Set up auth state listener FIRST to prevent missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("User authenticated, fetching profile");
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          console.log("No authenticated user");
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session found" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data with improved error handling
  const fetchProfile = async (userId: string) => {
    console.log("Fetching profile for user:", userId);
    try {
      // Use the get_profile_by_id function instead of direct table query
      const { data, error } = await supabase
        .rpc('get_profile_by_id', { user_id: userId });

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load user profile");
        setProfile(null);
      } else if (data && data.length > 0) {
        console.log("Profile loaded successfully:", data[0]);
        setProfile(data[0] as UserProfile);
      } else {
        console.warn("No profile found for user");
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
      toast.error("An unexpected error occurred");
      setProfile(null);
    }
  };

  // Sign in with email and password - improved error handling
  const signIn = async (email: string, password: string) => {
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
        console.log("Sign in successful, fetching profile");
        await fetchProfile(data.user.id);
        
        toast.success("Berhasil masuk!");
        
        // Navigate based on role - Now handled by the component
      }

      return { error: null };
    } catch (error) {
      console.error("Exception during sign in:", error);
      toast.error("Terjadi kesalahan saat login");
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
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
  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
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
