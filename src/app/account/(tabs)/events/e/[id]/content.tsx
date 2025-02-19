"use client";

import { getUserID } from "@/app/actions";
import { ConvexCtx } from "@/app/ctx/convex";
import { Carousel } from "@/ui/carousel";
import { Err } from "@/utils/helpers";
import type { SelectEvent } from "convex/events/d";
import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type Dispatch,
  type JSX,
  type SetStateAction,
  type TransitionStartFunction,
} from "react";
import { CoverPhoto } from "./components/cover-photo";
import { EventDetails } from "./components/details";
import { BasicContent } from "./components/details/basic";
import { VIPContent } from "./components/details/vip";
import { ImageQuery } from "./components/pexels";
import { TicketPhoto } from "./components/ticket-photo";
import { Topbar } from "./components/topbar";
import { EventEditorCtxProvider } from "./ctx";
// import SendTicket from "./components/email/send-ticket";
// import SendInvite from "./components/email/send-invite";

export interface TabItem {
  title: string;
  value: string;
  content: JSX.Element;
}

interface EventContentProps {
  id: string;
}
export const Content = ({ id }: EventContentProps) => {
  const { events } = use(ConvexCtx)!;
  const [event_id] = id.split("---");
  const [event, setEvent] = useState<SelectEvent | null>(null);
  const [user_id, setUserId] = useState<string>();

  const getUserId = useCallback(async () => {
    setUserId(await getUserID());
  }, []);

  useEffect(() => {
    getUserId().catch(Err);
  }, [getUserId]);

  const get = useCallback(async () => {
    if (!event_id) return null;
    return await events.get.byId(event_id);
  }, [events.get, event_id]);

  const [pending, fn] = useTransition();
  const setFn = <T,>(
    tx: TransitionStartFunction,
    action: () => Promise<T>,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    tx(async () => {
      set(await action());
    });
  };

  const getEvent = useCallback(() => {
    setFn(fn, get, setEvent);
  }, [get]);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  const tabs: TabItem[] = useMemo(
    () => [
      {
        value: "info",
        title: "Info",
        content: <BasicContent event={event} pending={pending} />,
      },
      {
        value: "tickets",
        title: "Tickets",
        content: <BasicContent event={event} pending={pending} />,
      },
      {
        value: "vips",
        title: "VIPs",
        content: <VIPContent event={event} user_id={user_id} />,
      },
    ],
    [user_id, event, pending],
  );

  return (
    <EventEditorCtxProvider>
      <main className="h-full bg-gray-100">
        <Topbar event_name={event?.event_name} />
        <ImageQuery category={event?.category} />

        <div className="h-full md:px-4">
          <Carousel>
            <div className="grid h-fit w-full grid-cols-1 gap-10 md:min-h-[400px] md:grid-cols-2 md:gap-6 md:px-4">
              <CoverPhoto id={event_id} cover_url={event?.cover_url} />
              <TicketPhoto event={event} />
            </div>
          </Carousel>

          <EventDetails tabs={tabs} />
        </div>
      </main>
    </EventEditorCtxProvider>
  );
};

export const inputClassNames = {
  innerWrapper: "border-0 bg-white p-3 shadow-none rounded-xl",
  inputWrapper: "h-16 p-0 bg-white data-hover:bg-white shadow-none",
  label: "ps-3 pb-0.5 opacity-60 text-sm tracking-tight",
  input:
    "font-bold tracking-tight placeholder:font-semibold shadow-none focus:placeholder:opacity-40 placeholder:text-primary font-inter placeholder:text-sm",
};
