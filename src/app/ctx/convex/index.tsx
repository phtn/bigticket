"use client";

import { env } from "@/env";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useVxFiles, type VxFiles } from "./useVxFiles";
import { useVxEvents, type VxEvents } from "./useVxEvents";
import { useVxUsers, type VxUsers } from "./useVxUsers";
import { useVxLogs, type VxLogs } from "./useVxLogs";

interface ConvexProviderProps {
  children: ReactNode;
}

interface ConvexCtxValues {
  vxFiles: VxFiles;
  vxEvents: VxEvents;
  vxUsers: VxUsers;
  vxLogs: VxLogs;
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
export const ConvexCtx = createContext<ConvexCtxValues | null>(null);

const CtxProvider = ({ children }: ConvexProviderProps) => {
  const vxUsers = useVxUsers();
  const vxFiles = useVxFiles();
  const vxEvents = useVxEvents();
  const vxLogs = useVxLogs();
  const value = {
    vxUsers,
    vxFiles,
    vxEvents,
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
