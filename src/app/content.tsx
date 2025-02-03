"use client";

import { Home } from "./_components/home";
import { GoogleOneTap } from "./ctx/auth/one-tap";
import { type SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "./ctx/event/preload";

export interface MainContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}

export const Content = (props: MainContentProps) => {
  return (
    <>
      <PreloadedEventsCtxProvider {...props}>
        <Home />
      </PreloadedEventsCtxProvider>
      <GoogleOneTap />
    </>
  );
};
