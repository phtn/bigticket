"use client";

import { Brand } from "./brand";
import { UserNav } from "./usernav";

export const Navbar = () => {
  return (
    <nav className="flex w-full border-b">
      <Brand />
      <UserNav />
    </nav>
  );
};
