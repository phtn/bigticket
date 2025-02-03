"use client";

import { Home } from "./_components/home";
import { GoogleOneTap } from "./ctx/auth/one-tap";
import { createContext } from "react";
import { type SelectEvent } from "convex/events/d";

export interface MainContentProps {
  slug: string[] | undefined;
  events: SelectEvent[];
}

export const PreloadedEventCtx = createContext<MainContentProps | null>(null);

export const Content = (props: MainContentProps) => {
  return (
    <>
      <PreloadedEventCtx value={props}>
        <Home />
      </PreloadedEventCtx>
      <GoogleOneTap />
    </>
  );
};
