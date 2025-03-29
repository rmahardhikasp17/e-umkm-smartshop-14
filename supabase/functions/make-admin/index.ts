
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { email, password, full_name } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Creating admin account for ${email}...`);

    // 1. Create the user with auth.admin.createUser
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (userError) {
      console.error("Error creating user:", userError);
      throw userError;
    }

    const userId = userData.user.id;
    console.log(`User created with ID: ${userId}`);

    // 2. Update the profile role to 'admin'
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw profileError;
    }

    console.log(`Admin role assigned to user: ${userId}`);

    return new Response(
      JSON.stringify({ 
        message: "Admin account created successfully",
        user: userData.user 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in make-admin function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
