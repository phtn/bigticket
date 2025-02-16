"use client";

import { Carousel } from "@/ui/carousel";
import { use, useCallback, useEffect, useState } from "react";
import { CoverPhoto } from "./components/cover-photo";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtxProvider } from "./ctx";
import { ImageQuery } from "./components/pexels";
import { ConvexCtx } from "@/app/ctx/convex";
import { type SelectEvent } from "convex/events/d";
import { Err } from "@/utils/helpers";

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { events } = use(ConvexCtx)!;
  const [event_id] = id.split("---");
  const [event, setEvent] = useState<SelectEvent | null>(null);

  const get = useCallback(async () => {
    setEvent(await events.get.byId(event_id!));
  }, [events.get, event_id]);

  useEffect(() => {
    get().catch(Err);
  }, [get]);

  return (
    <EventEditorCtxProvider>
      <main className="h-screen bg-gray-100">
        <Topbar event_name={event?.event_name} />
        <ImageQuery category={event?.category} />

        <div className="h-full px-2 md:px-4">
          <Carousel>
            <div className="grid h-fit w-full overflow-hidden rounded-xl border border-primary/60 bg-white md:min-h-[420px] md:grid-cols-2">
              <CoverPhoto id={event_id} cover_url={event?.cover_url} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>
          <div className="py-4 text-xs">
            <div className="w-fit space-y-2 rounded-md bg-gray-200 p-2">
              <p>
                <span className="font-bold">Event Configurator</span> &rarr;
                In-progress
              </p>
              <pre className="">id: 010f</pre>
            </div>
          </div>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
