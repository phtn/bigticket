"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuthStore } from "./store";
import { useSession } from "./useSession";
import type { AuthCtxValues } from "./types";
import { deleteAccountID, deleteUserID } from "@/app/actions";

export const AuthContext = createContext<AuthCtxValues | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = useSupabaseClient();
  const { session, isLoading } = useSession();
  const { updateUser, setLoading, user } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    if (session?.user) {
      updateUser(session.user);
    } else {
      updateUser(null);
    }

    setLoading(isLoading);
  }, [session, isLoading, updateUser, setLoading]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await deleteUserID();
      await deleteAccountID();
      await supabase.auth.signOut();
      updateUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading, updateUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      metadata: user?.user_metadata,
      isAuthed: !!user,
      updateUser,
      setLoading,
      logout,
    }),
    [user, isLoading, updateUser, setLoading, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
