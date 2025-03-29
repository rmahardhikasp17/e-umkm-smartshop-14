
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

interface RequireAuthProps {
  children: React.ReactNode;
}

// Use this component to ensure the user is logged in for specific pages/features
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show nothing
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If not logged in, redirect to login with return path
  if (!user) {
    toast.error("Anda harus login terlebih dahulu");
    
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
