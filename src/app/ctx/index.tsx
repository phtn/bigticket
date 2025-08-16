"use client";

import { TRPCProvider } from "@/trpc/react";
import { NextUIProvider } from "@nextui-org/react";
import { type ReactNode } from "react";
import AccountAuthProvider from "./auth";
import { SidebarCtxProvider } from "./sidebar";
import { Toasts } from "./toast";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <AccountAuthProvider>
        <TRPCProvider>
          <SidebarCtxProvider>{children}</SidebarCtxProvider>
        </TRPCProvider>
        <Toasts />
      </AccountAuthProvider>
    </NextUIProvider>
  );
};

export default Providers;
