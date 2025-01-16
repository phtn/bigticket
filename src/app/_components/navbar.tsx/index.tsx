"use client";

import { Brand, BrandName, HotDealsButton, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <nav className="relative z-[100] flex w-full">
      <Brand>
        <BrandName>
          <Tickets />
          <Title />
        </BrandName>
        <HotDealsButton />
      </Brand>
      <UserNav />
    </nav>
  );
};
