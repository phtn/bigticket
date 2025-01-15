"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import Convex from "@/app/ctx/convex";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { onAwait } from "../toast";
import { Err } from "@/utils/helpers";
import { deleteUserID } from "@/app/actions";
import type { AuthCtxValues, SupabaseUserMetadata } from "./types";
import SessionProvider from "./session";

export const AuthCtx = createContext<AuthCtxValues | null>(null);
interface AuthCtxProps {
  children: ReactNode;
}
const AuthProvider = ({ children }: AuthCtxProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [meta, setMeta] = useState<SupabaseUserMetadata>();

  const supabase = useSupabaseClient().auth;

  const signOut = useCallback(async () => {
    const initSignOut = async () => {
      await deleteUserID();
      await supabase.signOut().catch(Err(setLoading));
    };
    await onAwait(initSignOut, "Signing out . . .", "Sign out.");
  }, [supabase]);

  const updateUser = useCallback(
    (user: User | null) => {
      setUser(user);
      setMeta(user?.user_metadata);
    },
    [setUser],
  );

  const value = useMemo(
    () => ({
      updateUser,
      loading,
      signOut,
      meta,
      user,
    }),
    [loading, user, meta, signOut, updateUser],
  );

  return (
    <SessionProvider>
      <AuthCtx value={value}>
        <Convex user={user}>{children}</Convex>
      </AuthCtx>
    </SessionProvider>
  );
};

export default AuthProvider;
