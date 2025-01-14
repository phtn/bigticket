import type { User } from "@supabase/supabase-js";

export interface SupabaseUserMetadata {
  name?: string;
  avatar_url?: string;
  fullname?: string;
}

export interface AuthCtxValues {
  loading: boolean;
  user: User | null;
  signOut: () => Promise<void>;
  updateUser: (user: User | null) => void;
  meta: SupabaseUserMetadata | undefined;
}
