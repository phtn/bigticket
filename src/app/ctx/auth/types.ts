import type { User } from "@supabase/supabase-js";

export interface SupabaseUserMetadata {
  name?: string;
  avatar_url?: string;
  fullname?: string;
}

export interface AuthCtxValues {
  user: User | null;
  updateUser: (user: User | null) => void;
  meta: SupabaseUserMetadata | undefined;
}
