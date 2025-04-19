import React, { useState } from "react";
import { formatPrice } from "@/utils/data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

const CartSummary: React.FC<{ totalPrice: number; onCheckout: () => void; onClearCart: () => void; }> = ({ totalPrice, onCheckout, onClearCart }) => {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const { items } = useCart();
    const { user } = useAuth();

    const handleStripeCheckout = async () => {
        try {
            setIsProcessingPayment(true);
            toast.info("Mempersiapkan checkout...");

            const response = await fetch('/.netlify/functions/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    email: user?.email || '',
                }),
            });

            const session = await response.json();
            if (response.ok) {
                window.location.href = session.url; // Redirect to Stripe Checkout
            } else {
                throw new Error(session.error);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Gagal memproses pembayaran. Silakan coba lagi.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <div>
            <h2>Ringkasan Pesanan</h2>
            <div>
                <span>Total: {formatPrice(totalPrice)}</span>
            </div>
            <Button onClick={handleStripeCheckout} disabled={isProcessingPayment || items.length === 0}>
                {isProcessingPayment ? "Memproses..." : "Bayar dengan Stripe"}
            </Button>
            <Button onClick={onClearCart} disabled={isProcessingPayment || items.length === 0}>
                Kosongkan Keranjang
            </Button>
        </div>
    );
};

export default CartSummary;