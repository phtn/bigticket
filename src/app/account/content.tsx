"use client";

import { TabComponent } from "./_components_/tabs";
import { AccountContext } from "./ctx";
import { Profile } from "./profile";

export const Content = () => {
  return (
    <AccountContext>
      <main className="flex w-full flex-col space-y-8 overflow-y-scroll bg-background">
        <div className="relative w-full">
          <Profile />
        </div>
        <div className="size-full">
          <TabComponent />
        </div>
      </main>
    </AccountContext>
  );
};
