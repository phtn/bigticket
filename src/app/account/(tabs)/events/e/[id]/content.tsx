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

        <div className="h-full md:px-4">
          <Carousel>
            <div className="grid h-fit w-full gap-6 md:min-h-[420px] md:grid-cols-2 md:px-4">
              <CoverPhoto id={event_id} cover_url={event?.cover_url} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>
          <div className="w-full p-4 text-xs">
            <div className="space-y-2 rounded-md bg-gray-200 p-2">
              <h2>
                <span className="text-2xl font-bold tracking-tighter">
                  Event Details
                </span>
              </h2>
              <pre className=""></pre>
            </div>
          </div>
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};
