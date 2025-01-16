"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import Convex from "@/app/ctx/convex";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { AuthCtxValues, SupabaseUserMetadata } from "./types";
import SessionProvider from "./session";

export const AuthCtx = createContext<AuthCtxValues | null>(null);
interface AuthCtxProps {
  children: ReactNode;
}
const AuthProvider = ({ children }: AuthCtxProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [meta, setMeta] = useState<SupabaseUserMetadata>();

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
      meta,
      user,
    }),
    [user, meta, updateUser],
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
