"use client";

import { env } from "@/env";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useVxFiles, type VxFiles } from "./useVxFiles";
import { useVxEvents, type VxEvents } from "./useVxEvents";
import { useVxUsers, type VxUsers } from "./useVxUsers";
import { useVxAccounts, type VxAccounts } from "./useVxAccounts";
import { useVxLogs, type VxLogs } from "./useVxLogs";

interface ConvexProviderProps {
  children: ReactNode;
}

interface ConvexCtxValues {
  vxAccounts: VxAccounts;
  vxEvents: VxEvents;
  vxUsers: VxUsers;
  vxFiles: VxFiles;
  vxLogs: VxLogs;
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
export const ConvexCtx = createContext<ConvexCtxValues | null>(null);

const CtxProvider = ({ children }: ConvexProviderProps) => {
  const vxAccounts = useVxAccounts();
  const vxEvents = useVxEvents();
  const vxUsers = useVxUsers();
  const vxFiles = useVxFiles();
  const vxLogs = useVxLogs();
  const value = {
    vxAccounts,
    vxEvents,
    vxUsers,
    vxFiles,
    vxLogs,
  };

  return <ConvexCtx value={value}>{children}</ConvexCtx>;
};

const Provider = ({ children }: ConvexProviderProps) => {
  return (
    <ConvexProvider client={convex}>
      <CtxProvider>{children}</CtxProvider>
    </ConvexProvider>
  );
};

export default Provider;

export const useConvexCtx = () => {
  const context = useContext(ConvexCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
