"use client";

import type { SelectEvent } from "convex/events/d";
import { EventEditorCtxProvider } from "./ctx";
import { EventEditor } from "./editor";
import { PreloadedUserEventsCtxProvider } from "@/app/ctx/event/user";

export interface EventEditorContentProps {
  id: string | undefined;
  events: SelectEvent[];
}
export const EventEditorContent = (props: EventEditorContentProps) => {
  return (
    <PreloadedUserEventsCtxProvider {...props}>
      <EventEditorCtxProvider>
        <EventEditor id={props.id} />
      </EventEditorCtxProvider>
    </PreloadedUserEventsCtxProvider>
  );
};
