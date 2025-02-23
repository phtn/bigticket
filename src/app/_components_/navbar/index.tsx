"use client";

import { UserCtxProvider } from "@/app/ctx/user/ctx";
import { Brand, BrandName, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <div className="fixed z-[100] flex h-16 w-full bg-white">
      <Brand>
        <BrandName>
          <Tickets />
          <Title />
        </BrandName>
      </Brand>
      <UserCtxProvider>
        <UserNav />
      </UserCtxProvider>
    </div>
  );
};
