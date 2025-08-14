"use client";

import { TRPCProvider } from "@/trpc/react";
import { NextUIProvider } from "@nextui-org/react";
import { type ReactNode } from "react";
import AuthProvider from "./auth";
import { SidebarCtxProvider } from "./sidebar";
import { Toasts } from "./toast";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <AuthProvider>
        <TRPCProvider>
          <SidebarCtxProvider>{children}</SidebarCtxProvider>
        </TRPCProvider>
        <Toasts />
      </AuthProvider>
    </NextUIProvider>
  );
};

export default Providers;
