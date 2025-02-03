"use client";

import { type ReactNode } from "react";
import { Profile } from "./profile";
import { TabComponent } from "./_components_/tabs";

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col space-y-8 overflow-y-scroll bg-background">
      <Profile />
      <TabComponent>{children}</TabComponent>
    </main>
  );
};
export default AccountLayout;
