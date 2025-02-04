"use client";

import { Home } from "./_components_/home";
import { GoogleOneTap } from "./ctx/auth/one-tap";
import { type SelectEvent } from "convex/events/d";
import { PreloadedEventsCtxProvider } from "./ctx/event/preload";
import { EventViewerCtxProvider } from "./ctx/event";
import { EventViewer } from "./_components_/event-viewer/viewer";

export interface MainContentProps {
  slug: string[] | undefined;
  preloaded: SelectEvent[];
}

export const Content = (props: MainContentProps) => {
  return (
    <>
      <PreloadedEventsCtxProvider {...props}>
        <EventViewerCtxProvider>
          <Home />
          <EventViewer />
        </EventViewerCtxProvider>
      </PreloadedEventsCtxProvider>
      <GoogleOneTap />
    </>
  );
};
