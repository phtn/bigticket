"use client";

import { AccountCtxProvider } from "@/app/ctx/accounts";
import { UserSettings } from "./settings";

export const Content = () => (
  <AccountCtxProvider>
    <UserSettings />
  </AccountCtxProvider>
);
