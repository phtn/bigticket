import type { User } from "@supabase/supabase-js";

export interface SupabaseUserMetadata {
  name?: string;
  full_name?: string;
  iss?: string;
  sub?: string;
  provider_id?: string;
}

export interface AuthCtxValues {
  user: User | null;
  updateUser: (user: User | null) => void;
  metadata: SupabaseUserMetadata | undefined;
  isLoading: boolean;
  isAuthed: boolean;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}
