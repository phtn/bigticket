"use client";

import { Home } from "@/app/(search)/home";
import { GoogleOneTap } from "@/app/ctx/auth/one-tap";

export const Content = () => {
  return (
    <>
      <Home />
      <GoogleOneTap />
    </>
  );
};
