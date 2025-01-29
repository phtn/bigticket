"use client";

import { VxCtx } from "@/app/ctx/convex/vx";
import { Carousel } from "@/ui/carousel";
import { use } from "react";
import { CoverPhoto } from "./components/cover-photo";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtxProvider } from "./ctx";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { vxEvents } = use(VxCtx)!;
  const event = vxEvents?.find((e) => e.event_id === id);

  return (
    <EventEditorCtxProvider>
      <main className="h-[calc(92vh)] overflow-y-scroll">
        <Topbar event_name={event?.event_name} />
        <div className="h-full px-4">
          <Carousel>
            <div className="grid h-fit min-h-[342px] w-full grid-cols-2 overflow-hidden rounded-md border border-primary bg-white">
              <CoverPhoto id={id} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
