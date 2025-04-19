
import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useEffect } from "react"

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  
  useEffect(() => {
    // Clear the cart after successful payment
    clearCart()
  }, [clearCart])

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Pembayaran Berhasil!</h1>
        <p className="text-muted-foreground">
          Terima kasih telah berbelanja di toko kami.
        </p>
        <div className="pt-4">
          <Button onClick={() => navigate("/")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default PaymentSuccess
