"use client";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCProvider } from "@/trpc/react";
import { type ReactNode } from "react";
import { Toasts } from "./toast";
import AuthProvider from "./auth";
import { CursorProvider } from "./cursor";
import { SidebarCtxProvider } from "./sidebar";
import { BaseProvider } from "./base";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <BaseProvider>
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
    </BaseProvider>
  );
};

export default Providers;
