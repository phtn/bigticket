"use client";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCProvider } from "@/trpc/react";
import type { ReactNode } from "react";
import { Toasts } from "./toast";
import AuthProvider from "./auth";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <AuthProvider>
        <TRPCProvider>{children}</TRPCProvider>
        <Toasts />
      </AuthProvider>
    </NextUIProvider>
  );
};
export default Providers;
