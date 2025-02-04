"use client";

import { Carousel } from "@/ui/carousel";
import { use } from "react";
import { CoverPhoto } from "./components/cover-photo";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtxProvider } from "./ctx";
import { ImageQuery } from "./components/pexels";
import { PreloadedEventsCtx } from "@/app/ctx/event";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const preloaded = use(PreloadedEventsCtx);
  const [event_id] = id.split("---");
  const event = preloaded?.signedEvents?.find((e) => e.event_id === event_id);

  return (
    <EventEditorCtxProvider>
      <main className="h-screen">
        <Topbar event_name={event?.event_name} />
        <ImageQuery />

        <div className="h-full px-2 md:px-4">
          <Carousel>
            <div className="grid h-fit w-full overflow-hidden rounded-xl border border-primary/60 bg-white md:min-h-[420px] md:grid-cols-2">
              <CoverPhoto id={event_id} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
