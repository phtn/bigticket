import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { SupabaseUserMetadata } from "./types";
import { type CreateUser } from "convex/users/d";

interface AuthState {
  user: User | null;
  metadata: SupabaseUserMetadata | undefined;
  isLoading: boolean;
  isAuthed: boolean;
  createUser: (user: User) => CreateUser;
  updateUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthed: (authed: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  metadata: undefined,
  isLoading: true,
  isAuthed: false,
  createUser: (user): CreateUser => ({
    id: user.id,
    phone_number: user.phone,
    metadata: user.user_metadata,
    email: user.user_metadata.email as string,
    nickname: user.user_metadata.name as string,
    fullname: user.user_metadata.full_name as string,
    photo_url: user.user_metadata.avatar_url as string,
    email_verified: user.user_metadata.email_verified as boolean,
    token_identifier: `${user.user_metadata.iss as string}|${user.user_metadata.sub as string}`,
  }),
  updateUser: (user) =>
    set(() => ({
      user,
      metadata: user?.user_metadata,
      isAuthed: !!user,
      tokenIdentifier: `${user?.user_metadata?.iss}|${user?.user_metadata?.sub}`,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setAuthed: (isAuthed) => set({ isAuthed }),
  reset: () =>
    set({
      user: null,
      metadata: undefined,
      isLoading: false,
      isAuthed: false,
    }),
}));
