"use client";

import { VxCtx } from "@/app/ctx/convex/vx";
import { Carousel } from "@/ui/carousel";
import { use } from "react";
import { CoverPhoto } from "./components/cover-photo";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtxProvider } from "./ctx";
import { ImageQuery } from "@/app/_components/sidebar";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { vxEvents } = use(VxCtx)!;
  const event = vxEvents?.find((e) => e.event_id === id);

  return (
    <EventEditorCtxProvider>
      <main className="h-screen overflow-y-scroll">
        <Topbar event_name={event?.event_name} />
        <ImageQuery />

        <div className="h-full px-4">
          <Carousel>
            <div className="grid h-fit w-full overflow-hidden rounded-xl border border-primary/40 bg-white md:min-h-[342px] md:grid-cols-2">
              <CoverPhoto id={id} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
