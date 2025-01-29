"use client";

import { VxCtx } from "@/app/ctx/convex/vx";
import { use } from "react";
import { Topbar } from "./components/topbar";
import { EventPhoto } from "./components/event-photo";
import { TicketPhoto } from "./components/ticket-photo";
import { CoverPhoto } from "./components/cover-photo";
import { EventEditorCtxProvider } from "./ctx";
import { Carousel } from "@/ui/carousel";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { vxEvents } = use(VxCtx)!;
  const event = vxEvents?.find((e) => e.event_id === id);

  return (
    <EventEditorCtxProvider>
      <main className="h-full overflow-y-scroll">
        <Topbar event_name={event?.event_name} />
        <div className="h-full px-4">
          <Carousel>
            <div className="grid h-fit min-h-80 w-full overflow-hidden rounded-md border border-primary bg-white md:grid-cols-2 xl:grid-cols-3">
              <CoverPhoto id={id} />
              <EventPhoto />
              <TicketPhoto event={event} />
            </div>
          </Carousel>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
