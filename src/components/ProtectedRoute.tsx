
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, isLoading } = useAuth();

  // While checking authentication status, show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Memuat...</span>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    toast.error("Anda harus login terlebih dahulu");
    return <Navigate to="/login" />;
  }

  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    toast.error("Anda tidak memiliki akses ke halaman ini");
    return <Navigate to="/" />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
