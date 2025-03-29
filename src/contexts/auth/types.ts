
import { Session, User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
}

export interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}
