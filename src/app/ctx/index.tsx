"use client";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCProvider } from "@/trpc/react";
import { type ReactNode } from "react";
import { Toasts } from "./toast";
import AuthProvider from "./auth";
import { SidebarCtxProvider } from "./sidebar";
import { BaseProvider } from "./base";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <BaseProvider>
      <NextUIProvider>
        <AuthProvider>
          <TRPCProvider>
            <SidebarCtxProvider>{children}</SidebarCtxProvider>
          </TRPCProvider>
          <Toasts />
        </AuthProvider>
      </NextUIProvider>
    </BaseProvider>
  );
};

export default Providers;
