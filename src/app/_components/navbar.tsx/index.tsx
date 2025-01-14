"use client";

import { Brand, BrandName, HotDealsButton, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <nav className="flex w-full border-b">
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
