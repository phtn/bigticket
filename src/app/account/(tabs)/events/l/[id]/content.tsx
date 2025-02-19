"use client";

import { usePathname } from "next/navigation";
import { LiveViewCtx, LiveViewCtxProvider } from "./ctx";
import { use, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { Icon } from "@/icons";
import { ScanCode } from "./components/scanner";
import { cn } from "@/lib/utils";

export const Content = () => (
  <LiveViewCtxProvider>
    <LiveView />
  </LiveViewCtxProvider>
);

const LiveView = () => {
  const pathname = usePathname();
  const ids = pathname.split("/").pop();
  const [event_id, user_id] = ids?.split("---") ?? ["", ""];

  const {
    getEventId,
    pending,
    event,
    cover_url,
    host_id,
    open,
    toggle,
    ticket_data,
    qrcode,
  } = use(LiveViewCtx)!;

  useEffect(() => {
    if (event_id) {
      getEventId(event_id);
    }
  }, [event_id, getEventId]);

  useEffect(() => {
    if (open && qrcode) {
      toggle();
    }
  }, [open, toggle, qrcode]);

  return (
    <main className="flex h-[calc(100vh-65px)] justify-center overflow-hidden bg-void">
      <div className="container h-full w-full">
        <div className="relative h-3/6 md:h-4/6">
          <Image
            src={cover_url ?? "/icon/logomark_v2.svg"}
            alt={event?.event_name}
            className="aspect-video h-lvh w-auto object-cover object-center"
          />
          <div className="absolute left-2 top-2 z-10 bg-void/10 p-2 backdrop-blur-md">
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
          </div>
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
          <Icon
            name="QrCode"
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
