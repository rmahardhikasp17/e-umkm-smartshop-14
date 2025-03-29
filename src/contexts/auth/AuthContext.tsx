
import React, { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { AuthContextProps, UserProfile } from "./types";
import { fetchProfile, createProfile } from "./profileService";
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from "./authService";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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
            handleProfileFetch(currentSession.user.id);
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
        await handleProfileFetch(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Handle profile fetching and creation if needed
  const handleProfileFetch = async (userId: string) => {
    const userProfile = await fetchProfile(userId);
    
    if (userProfile) {
      setProfile(userProfile);
    } else if (user) {
      // If no profile exists, try to create one
      const newProfile = await createProfile(userId, user);
      if (newProfile) {
        setProfile(newProfile);
      }
    }
  };

  // Sign in wrapper
  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    return result;
  };

  // Sign up wrapper
  const signUp = async (email: string, password: string, fullName: string) => {
    return await authSignUp(email, password, fullName);
  };

  // Sign out wrapper
  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    navigate("/");
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
