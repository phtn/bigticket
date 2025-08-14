"use client";

import { Brand, BrandName, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <div className="_flex fixed z-[100] hidden h-0 w-full bg-white">
      <Logo />
      <UserNav />
    </div>
  );
};

export const Logo = () => (
  <Brand>
    <BrandName>
      <Tickets />
      <Title />
    </BrandName>
  </Brand>
);
