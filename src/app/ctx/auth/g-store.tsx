import { create } from "zustand";
import type {
  User as Account,
  UserMetadata as AccountMetadata,
} from "firebase/auth";
import type { CreateAccount } from "convex/accounts/d";

interface AuthState {
  account: Account | null;
  metadata: AccountMetadata | undefined;
  isLoading: boolean;
  isAuthed: boolean;
  createAccount: (account: Account) => CreateAccount;
  updateAccount: (account: Account | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthed: (authed: boolean) => void;
  reset: () => void;
}

export const useAccountAuthStore = create<AuthState>((set) => ({
  account: null,
  metadata: undefined,
  isLoading: true,
  isAuthed: false,
  createAccount: (account): CreateAccount => ({
    id: account.uid,
    phone_number: account.phoneNumber!,
    email: account.email!,
    nickname: account.displayName!,
    photo_url: account.photoURL!,
    email_verified: account.emailVerified,
  }),
  updateAccount: (account) =>
    set(() => ({
      ...account,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setAuthed: (isAuthed) => set({ isAuthed }),
  reset: () =>
    set({
      account: null,
      metadata: undefined,
      isLoading: false,
      isAuthed: false,
    }),
}));
