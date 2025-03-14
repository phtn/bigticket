"use client";

import { type ReactNode } from "react";
import { Profile } from "./profile";
import { TabComponent } from "./_components_/tabs";

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col overflow-y-scroll border-t border-primary/10 bg-gray-200">
      <Profile />
      <TabComponent>{children}</TabComponent>
    </main>
  );
};
export default AccountLayout;
