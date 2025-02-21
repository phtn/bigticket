"use client";

import { EventViewer } from "@/app/(search)/@ev/components/viewer";
import {
  EventViewerCtxProvider,
  PreloadedEventsCtxProvider,
} from "@/app/ctx/event";
import type { SelectEvent } from "convex/events/d";
import { useSearchParams } from "next/navigation";

export interface EVContentProps {
  events: SelectEvent[];
}
export const EVContent = (props: EVContentProps) => {
  const searchParams = useSearchParams();
  const event_id = searchParams.get("x");
  console.log(event_id);

  return (
    <PreloadedEventsCtxProvider {...props}>
      <EventViewerCtxProvider>
        <EventViewer />
      </EventViewerCtxProvider>
    </PreloadedEventsCtxProvider>
  );
};
