"use client";

import { VxCtx } from "@/app/ctx/convex/vx";
import { use } from "react";
import { Topbar } from "./components/topbar";
import { EventPhoto } from "./components/event-photo";
import { TicketPhoto } from "./components/ticket-photo";
import { CoverPhoto } from "./components/cover-photo";
import { EventEditorCtxProvider } from "./ctx";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { vxEvents } = use(VxCtx)!;
  const event = vxEvents?.find((e) => e.event_id === id);

  return (
    <EventEditorCtxProvider>
      <main>
        <Topbar event_name={event?.event_name} id={id} />
        <div className="px-4">
          <div className="grid h-fit min-h-80 w-full grid-cols-3 overflow-hidden rounded-md border border-primary bg-white">
            <CoverPhoto />
            <EventPhoto />
            <TicketPhoto event={event} />
          </div>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
