"use client";

import { UserCtxProvider } from "@/app/ctx/user/ctx";
import { UserSettings } from "./settings";

export const Content = () => (
  <UserCtxProvider>
    <UserSettings />
  </UserCtxProvider>
);
