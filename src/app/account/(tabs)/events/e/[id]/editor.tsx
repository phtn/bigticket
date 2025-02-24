"use client";

import { getUserID } from "@/app/actions";
import { Carousel } from "@/ui/carousel";
import { Err } from "@/utils/helpers";
import {
  type JSX,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CoverPhoto } from "./components/cover-photo";
import { EventDetails } from "./components/details";
import { BasicContent } from "./components/details/basic";
import { EventDetailCtxProvider } from "./components/details/ctx";
import { HostSettings } from "./components/details/hosting";
import { VIPContent } from "./components/details/vip";
import { ImageQuery } from "./components/pexels";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtx } from "./ctx";

export interface TabItem {
  title: string;
  value: string;
  content: JSX.Element;
}

interface EventEditorProps {
  id: string | undefined;
}
export const EventEditor = ({ id }: EventEditorProps) => {
  const [event_id] = id?.split("---") ?? [];
  const { getXEvent, xEvent, pending } = use(EventEditorCtx)!;
  const [user_id, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getXEvent(event_id);
  }, [getXEvent, event_id]);

  const getUserId = useCallback(async () => {
    setUserId(await getUserID());
  }, []);

  useEffect(() => {
    getUserId().catch(Err);
  }, [getUserId]);

  const tabs: TabItem[] = useMemo(
    () => [
      {
        value: "info",
        title: "Info",
        content: <BasicContent xEvent={xEvent} pending={pending} />,
      },
      {
        value: "tickets",
        title: "Tickets",
        content: <BasicContent xEvent={xEvent} pending={pending} />,
      },
      {
        value: "vips",
        title: "VIPs",
        content: <VIPContent xEvent={xEvent} user_id={user_id} />,
      },
      {
        value: "host",
        title: "Hosting",
        content: <HostSettings xEvent={xEvent} user_id={user_id} />,
      },
    ],
    [user_id, xEvent, pending],
  );

  return (
    <main className="h-full bg-gray-200">
      <Topbar event_name={xEvent?.event_name} />
      <ImageQuery category={xEvent?.category} />

      <div className="space-y-8">
        <div className="h-fit md:px-4">
          <Carousel>
            <div className="grid h-fit w-full grid-cols-1 gap-10 md:min-h-[400px] md:grid-cols-2 md:gap-6 md:px-4">
              <CoverPhoto id={event_id} cover_url={xEvent?.cover_url} />
              <TicketPhoto xEvent={xEvent} />
            </div>
          </Carousel>
        </div>

        <div className="h-fit md:px-8">
          <EventDetailCtxProvider>
            <EventDetails tabs={tabs} />
          </EventDetailCtxProvider>
        </div>
      </div>
    </main>
  );
};

export const inputClassNames = {
  innerWrapper: "border-0 bg-white p-3 shadow-none rounded-xl",
  inputWrapper: "h-16 p-0 bg-white data-hover:bg-white shadow-none",
  label: "ps-3 pb-0.5 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold shadow-none focus:placeholder:opacity-40 placeholder:text-primary font-inter placeholder:text-sm",
};
