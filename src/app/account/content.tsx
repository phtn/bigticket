"use client";

import { AccountContext } from "./ctx";
import { Profile } from "./profile";

export const Content = () => {
  return (
    <AccountContext>
      <main className="flex w-full flex-col space-y-8 overflow-y-scroll rounded-3xl bg-background">
        <div className="relative">
          <Profile />
        </div>
        <div className="w-full border-void/20 px-6 py-2"></div>
      </main>
    </AccountContext>
  );
};
