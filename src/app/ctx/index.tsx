"use client";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCProvider } from "@/trpc/react";
import type { ReactNode } from "react";
import { Toasts } from "./toast";
import AuthProvider from "./auth";
import { CursorProvider } from "./cursor";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <AuthProvider>
        <TRPCProvider>
          <CursorProvider>{children}</CursorProvider>
        </TRPCProvider>
        <Toasts />
      </AuthProvider>
    </NextUIProvider>
  );
};
export default Providers;
