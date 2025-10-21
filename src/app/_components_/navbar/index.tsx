"use client";

import { Brand, BrandName, Tickets, Title } from "./brand";
import { UserNav } from "./usernav";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <div className="fixed top-0 z-[100] flex h-16 w-full items-center justify-between bg-white">
      <Logo />
      <UserNav />
    </div>
  );
};

export const _Logo = () => (
  <Brand>
    <BrandName>
      <Tickets />
      <Title />
    </BrandName>
  </Brand>
);

export const Spacer = () => <div className="relative h-16" />;
