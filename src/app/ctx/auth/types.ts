import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { User as AccountUser } from "firebase/auth";

export interface SupabaseUserMetadata {
  name?: string;
  full_name?: string;
  iss?: string;
  sub?: string;
  provider_id?: string;
}

export interface AuthCtxValues {
  supabase: SupabaseClient;
  user: User | null;
  updateUser: (user: User | null) => void;
  metadata: SupabaseUserMetadata | undefined;
  isLoading: boolean;
  isAuthed: boolean;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export interface AccountAuthCtxValues {
  account: AccountUser | null;
  updateAccount: (user: AccountUser | null) => void;
  isLoading: boolean;
  isAuthed: boolean;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}
