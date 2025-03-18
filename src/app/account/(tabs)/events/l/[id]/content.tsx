"use client";

import { LiveViewCtx, LiveViewCtxProvider } from "./ctx";
import { use, useCallback, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { ScanCode } from "./components/scanner";
import { cn } from "@/lib/utils";
import { Iconx } from "@/icons";

export const Content = () => (
  <LiveViewCtxProvider>
    <LiveView />
  </LiveViewCtxProvider>
);

const LiveView = () => {
  const { event, cover_url, open, toggle, qrcode } = use(LiveViewCtx)!;

  useEffect(() => {
    if (open && qrcode) {
      toggle();
    }
  }, [open, toggle, qrcode]);

  const TitleSection = useCallback(
    () => (
      <section className="absolute left-4 top-4 z-50 w-full overflow-clip text-ellipsis bg-ticket/30 backdrop-blur-md">
        <p className="max-w-[45ch] bg-gradient-to-br from-white/60 via-white/80 to-white/60 bg-clip-text text-tiny font-bold uppercase text-transparent">
          {event?.venue_name ?? event?.event_geo}
        </p>
        <h4 className="p-[1px font-inter text-xl font-bold capitalize tracking-tight text-chalk shadow-coal drop-shadow-sm">
          {event?.event_name}
        </h4>
      </section>
    ),
    [event?.event_geo, event?.venue_name, event?.event_name],
  );
  return (
    <main className="flex h-[calc(100vh-65px)] justify-center overflow-hidden bg-void">
      <div className="container h-full w-full">
        <div className="relative h-3/6 md:h-4/6">
          <TitleSection />
          <Image
            radius="none"
            src={cover_url ?? "/icon/logomark_v2.svg"}
            alt={event?.event_name}
            className={cn("aspect-square w-auto object-cover object-center", {
              "aspect-video": cover_url,
            })}
          />
          <div className="grid h-8 w-full grid-cols-3 items-center tracking-tighter">
            <div className="flex w-full items-center justify-between bg-white px-6">
              <span>Tickets</span> <span>{event?.ticket_count}</span>
            </div>
            <div className="flex w-full items-center justify-between bg-teal-500 px-6">
              <span>Scanned</span> <span>{event?.ticket_count}</span>
            </div>
            <div className="flex w-full items-center justify-between bg-peach px-6">
              <span>Remaining</span> <span>{event?.ticket_count}</span>
            </div>
          </div>
          {/* <div className="absolute left-2 top-2 z-10 bg-void/10 p-2 backdrop-blur-md">
            <p className="text-chalk">{event?.event_name}</p>
            <p className="text-peach">{cover_url}</p>
            <p className="text-secondary">{event_id}</p>
            <p className="text-chalk">{user_id}</p>
            <p className="text-chalk">{event?.host_id}</p>
            <p className="text-sky-400">user: {ticket_data?.user_account}</p>
            <p className="text-sky-400">event: {ticket_data?.event_account}</p>
            <p className="text-sky-400">
              ticket: {ticket_data?.ticket_account}
            </p>
            <p className="text-chalk">
              access role: {host_id === event?.host_id ? "Host" : "Guest"}
            </p>
            <p className="text-peach">
              status: {pending ? "Loading..." : "Idle"}
            </p>
          </div> */}
        </div>
        <div className="h-3/6 md:h-2/6">
          <div className="size-full">
            <div className="h-5/6"></div>
            <div className="h-1/6 w-full bg-peach"></div>
          </div>
        </div>

        <button
          onClick={toggle}
          className="fixed bottom-10 right-10 z-50 flex size-16 items-center justify-center rounded-full border bg-chalk transition-all duration-300 active:scale-90 active:bg-gray-600 active:text-chalk"
        >
          <Iconx
            name="qr-code"
            className={cn("size-7", { "text-peach": open })}
          />
        </button>
        {open && (
          <div className="fixed top-36 z-50 h-fit w-full md:left-1/4 md:flex md:h-[36rem] md:w-fit md:justify-center">
            <ScanCode />
          </div>
        )}
      </div>
    </main>
  );
};
