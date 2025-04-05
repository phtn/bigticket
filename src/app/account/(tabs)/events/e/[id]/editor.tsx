"use client";

import { Carousel } from "@/ui/carousel";
import { type JSX, useMemo } from "react";
import { CoverPhoto } from "./components/cover-photo";
import { EventDetails } from "./components/details";
import { BasicContent } from "./components/details/basic";
import { EventDetailCtxProvider } from "./components/details/ctx";
import { HostSettings } from "./components/details/hosting";
import { MediaContent } from "./components/details/media";
import { VIPContent } from "./components/details/vip";
import { ImageQuery } from "./components/pexels";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { useEventEditor } from "./ctx";
import { TicketContent } from "./components/details/ticket";

export interface TabItem {
  title: string;
  value: string;
  content: JSX.Element;
}

export const EventEditor = () => {
  const { xEvent, pending, event_id, user_id } = useEventEditor();

  const tabs: TabItem[] = useMemo(
    () => [
      {
        value: "info",
        title: "Info",
        content: <BasicContent event_id={event_id} pending={pending} />,
      },
      {
        value: "tickets",
        title: "Tickets",
        content: <TicketContent xEvent={xEvent} pending={pending} />,
      },
      {
        value: "host",
        title: "Hosting",
        content: <HostSettings xEvent={xEvent} user_id={user_id} />,
      },
      {
        value: "vips",
        title: "Guests",
        content: (
          <VIPContent xEvent={xEvent} user_id={user_id} event_id={event_id} />
        ),
      },

      {
        value: "media",
        title: "Media Gallery",
        content: <MediaContent xEvent={xEvent} user_id={user_id} />,
      },
    ],
    [user_id, xEvent, pending, event_id],
  );

  return (
    <main className="h-full bg-gray-200">
      <Topbar event_name={xEvent?.event_name} />
      <ImageQuery category={xEvent?.category} />

      <div className="space-y-8">
        <div className="md:px-4">
          <Carousel className="md:max-h-[480px]">
            <div className="grid h-fit w-full grid-cols-1 gap-10 md:min-h-[400px] md:grid-cols-2 md:gap-6 md:px-4">
              <CoverPhoto id={event_id} cover_url={xEvent?.cover_url} />
              <TicketPhoto xEvent={xEvent} />
            </div>
          </Carousel>
        </div>

        <div className="h-fit pb-8 md:px-8">
          <EventDetailCtxProvider>
            <EventDetails tabs={tabs} />
          </EventDetailCtxProvider>
        </div>
        <div className="h-96"></div>
      </div>
    </main>
  );
};

export const inputClassNames = {
  innerWrapper: "bg-white pt-4 pb-2.5 ps-4 shadow-none rounded-xl",
  inputWrapper: [" focus-ring focus-ring:macd-blue h-16 p-0 shadow-none"],
  label: "ps-5 opacity-60 tracking-tight text-[15px] leading-5",
  input: [
    "font-bold tracking-tight shadow-none font-inter bg-white",
    "placeholder:font-semibold focus:placeholder:opacity-40 placeholder:opacity-100 placeholder:drop-shadow-sm shadow-coal placeholder:text-teal-600 placeholder:text-sm",
    "",
  ],
};
export const inputClassNamesRight = {
  innerWrapper: "bg-white pt-4 pb-2.5 px-4 shadow-none rounded-xl",
  inputWrapper: [" focus-ring focus-ring:macd-blue h-16 p-0 shadow-none"],
  label: "ps-5 opacity-60 tracking-tight text-[15px] pb-0.5 leading-5",
  input: [
    "font-bold tracking-tight shadow-none font-inter bg-white shadow-coal",
    "placeholder:font-semibold focus:placeholder:opacity-40 placeholder:opacity-100",
    "placeholder:text-peach placeholder:text-sm placeholder:drop-shadow-sm",
    "text-right text-xl",
  ],
};
