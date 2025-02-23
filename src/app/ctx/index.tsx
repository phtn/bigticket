"use client";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCProvider } from "@/trpc/react";
import { type ReactNode } from "react";
import { Toasts } from "./toast";
import AuthProvider from "./auth";
import { CursorProvider } from "./cursor";
import { SidebarCtxProvider } from "./sidebar";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <AuthProvider>
        <TRPCProvider>
          <SidebarCtxProvider>
            <CursorProvider>{children}</CursorProvider>
          </SidebarCtxProvider>
        </TRPCProvider>
        <Toasts />
      </AuthProvider>
    </NextUIProvider>
  );
};


export default Providers;
