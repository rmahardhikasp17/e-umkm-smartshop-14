
import React from "react";
import PageTransition from "../components/transitions/PageTransition";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import CartLayout from "@/components/cart/CartLayout";

const Cart = () => {
  return (
    <ProtectedRoute>
      <PageTransition>
        <Navbar />
        <CartLayout />
      </PageTransition>
    </ProtectedRoute>
  );
};

export default Cart;
