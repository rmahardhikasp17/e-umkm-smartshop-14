
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Processing payment request...")
    const { items, email, shippingInfo } = await req.json()
    
    if (!items?.length) {
      throw new Error("No items in cart")
    }
    
    // Check if Stripe key is available
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("Missing Stripe secret key")
      throw new Error("Payment configuration error")
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    })

    console.log(`Creating checkout for ${items.length} items, email: ${email}`)

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      // Ensure price is an integer representing smallest currency unit (e.g., cents)
      const unitAmount = Math.round(item.price)
      
      console.log(`Processing item: ${item.name}, price: ${unitAmount}, quantity: ${item.quantity}`)
      
      return {
        price_data: {
          currency: "idr",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: unitAmount, // Price in smallest currency unit
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: {
        shipping_info: JSON.stringify(shippingInfo),
      },
    })

    console.log(`Checkout session created: ${session.id}, URL: ${session.url}`)

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error(`Error creating checkout session: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})
