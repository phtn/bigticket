"use client";

import { type ReactNode } from "react";
import Convex from "@/app/ctx/convex";
import SessionProvider from "./session";
import { AccountAuthProvider } from "./account-provider";
import { AccountCtxProvider } from "../accounts";

interface RootAuthProviderProps {
  children: ReactNode;
}

const RootAuthProvider = ({ children }: RootAuthProviderProps) => {
  return (
    <SessionProvider>
      <AccountAuthProvider>
        <Convex>
          <AccountCtxProvider>{children}</AccountCtxProvider>
        </Convex>
      </AccountAuthProvider>
    </SessionProvider>
  );
};

export default RootAuthProvider;
