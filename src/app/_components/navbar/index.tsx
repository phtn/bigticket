"use client";

import { Brand, BrandName, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <div className="relative z-[100] flex h-16 w-full bg-white">
      <Brand>
        <BrandName>
          <Tickets />
          <Title />
        </BrandName>
      </Brand>
      <UserNav />
    </div>
  );
};
