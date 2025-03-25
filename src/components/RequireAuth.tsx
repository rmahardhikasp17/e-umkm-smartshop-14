
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: React.ReactNode;
}

// Use this component to ensure the user is logged in for specific pages/features
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading, session } = useAuth();
  const location = useLocation();

  // Show error toast when redirecting
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Anda harus login terlebih dahulu");
    }
  }, [isLoading, user]);

  // While checking authentication status, show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Memuat...</span>
      </div>
    );
  }

  // If not logged in, redirect to login with return path
  if (!user || !session) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // If logged in, render the children
  return <>{children}</>;
};

export default RequireAuth;
