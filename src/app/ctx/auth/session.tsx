"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createContext, type ReactNode, useMemo, useState } from "react";

interface SessionCtxValues {
  on: boolean;
}
const SessionCtx = createContext<SessionCtxValues | null>(null);

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [supabaseClient] = useState(() => createClientComponentClient());
  const value = useMemo(
    () => ({
      on: false,
    }),
    [],
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <SessionCtx value={value}>{children}</SessionCtx>
    </SessionContextProvider>
  );
};
export default SessionProvider;
