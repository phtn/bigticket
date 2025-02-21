"use client";

import { Home } from "@/app/_components_/home";
import { GoogleOneTap } from "@/app/ctx/auth/one-tap";
import { type SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "@/app/ctx/event/all";
import { EventViewerCtxProvider } from "@/app/ctx/event";

export interface MainContentProps {
  slug: string[] | undefined;
  events: SelectEvent[];
}

export const Content = (props: MainContentProps) => {
  return (
    <>
      <PreloadedEventsCtxProvider {...props}>
        <EventViewerCtxProvider>
          <Home />
        </EventViewerCtxProvider>
      </PreloadedEventsCtxProvider>
      <GoogleOneTap />
    </>
  );
};
