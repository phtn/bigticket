"use client";

import { type ReactNode } from "react";
import Convex from "@/app/ctx/convex";
import SessionProvider from "./session";
import { UserCtxProvider } from "../user";
import { AuthProvider } from "./provider";

interface RootAuthProviderProps {
  children: ReactNode;
}

const RootAuthProvider = ({ children }: RootAuthProviderProps) => {
  return (
    <SessionProvider>
      <AuthProvider>
        <Convex>
          <UserCtxProvider>{children}</UserCtxProvider>
        </Convex>
      </AuthProvider>
    </SessionProvider>
  );
};

export default RootAuthProvider;
