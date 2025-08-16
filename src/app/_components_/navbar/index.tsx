"use client";

import { Brand, BrandName, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <div className="fixed z-[100] flex h-16 w-full items-center justify-between bg-white">
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

export const Spacer = () => <div className="relative h-16" />;
