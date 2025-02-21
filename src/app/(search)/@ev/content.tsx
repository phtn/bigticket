"use client";

import { EventViewer } from "@/app/(search)/@ev/components/viewer";
import {
  EventViewerCtxProvider,
  PreloadedEventsCtxProvider,
} from "@/app/ctx/event";
import type { SelectEvent } from "convex/events/d";

export interface EVContentProps {
  events: SelectEvent[];
}
export const EVContent = (props: EVContentProps) => {
  return (
    <PreloadedEventsCtxProvider {...props}>
      <EventViewerCtxProvider>
        <EventViewer />
      </EventViewerCtxProvider>
    </PreloadedEventsCtxProvider>
  );
};
