
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

// Fetch user profile data with improved error handling
export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log("Fetching profile for user:", userId);
  try {
    // First try to get the profile directly from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile from direct query:", profileError);
      
      // Fallback to using the RPC function if direct query fails
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_profile_by_id', { user_id: userId });

      if (rpcError) {
        console.error("Error fetching profile from RPC:", rpcError);
        toast.error("Failed to load user profile");
        return null;
      } else if (rpcData && rpcData.length > 0) {
        console.log("Profile loaded successfully from RPC:", rpcData[0]);
        return rpcData[0] as UserProfile;
      } else {
        console.warn("No profile found for user in RPC");
        return null;
      }
    } else if (profileData) {
      console.log("Profile loaded successfully:", profileData);
      return profileData as UserProfile;
    } else {
      console.warn("No profile found for user");
      return null;
    }
  } catch (error) {
    console.error("Exception fetching profile:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};

// Create profile if it doesn't exist
export const createProfile = async (userId: string, user: User | null): Promise<UserProfile | null> => {
  if (!user) return null;
  
  try {
    console.log("Creating new profile for user:", userId);
    
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      console.error("No user data found when creating profile");
      return null;
    }
    
    const newProfile = {
      id: userId,
      email: userData.user.email,
      role: 'user',
      full_name: userData.user.user_metadata?.full_name || null
    };
    
    const { error } = await supabase
      .from('profiles')
      .insert(newProfile);
      
    if (error) {
      console.error("Error creating profile:", error);
      return null;
    }
    
    console.log("Profile created successfully:", newProfile);
    return newProfile;
    
  } catch (error) {
    console.error("Exception creating profile:", error);
    return null;
  }
};
