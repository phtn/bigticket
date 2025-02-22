"use client";

import { Home } from "@/app/_components_/home";
import { GoogleOneTap } from "@/app/ctx/auth/one-tap";
import { type Preloaded } from "convex/react";
import { type api } from "@vx/api";

export interface MainContentProps {
  preloadedEvents: Preloaded<typeof api.events.get.all>;
}

export const Content = (props: MainContentProps) => {
  return (
    <>
      <Home {...props} />
      <GoogleOneTap />
    </>
  );
};
