"use client";

import { LiveViewCtxProvider, useScanView } from "./ctx";
import { useCallback, useEffect, useMemo } from "react";
import { Image } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { Iconx } from "@/icons";
import { Scanner } from "./components/qr-scanner";
import { type ClassName } from "@/app/types";
import { HyperList } from "@/ui/list";

export const Content = () => (
  <LiveViewCtxProvider>
    <LiveView />
  </LiveViewCtxProvider>
);

const LiveView = () => {
  const { event, cover_url, open, toggle, qrcode } = useScanView();

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
            src={cover_url ?? "/api/logo"}
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
        {/* {open && (
          <div className="fixed top-36 z-50 h-fit w-full md:left-1/4 md:flex md:h-[36rem] md:w-fit md:justify-center">
            <Scanner on={open} />
          </div>
        )} */}
        {open && (
          <div className="fixed top-0 z-50 h-fit w-full md:left-1/4 md:flex md:h-[36rem] md:w-fit md:justify-center"></div>
        )}
      </div>
      {/* <h4 className="p-2 font-inter text-xl font-bold capitalize tracking-tight text-chalk shadow-coal drop-shadow-sm">
                  QR-SCANNER
                </h4> */}
    </main>
  );
};

const ScanView = () => {
  const { event, cover_url, open, toggle, closeScanner, scannerRef } =
    useScanView();

  const stats = useMemo(
    () =>
      [
        {
          title: "Tickets",
          value: event?.ticket_count,
          style: "border-r px-6 text-gray-100",
        },
        {
          title: "Scanned",
          value: event?.tickets_scanned_count,
          style: "border-r px-6 text-secondary",
        },
        {
          title: "Remaining",
          value: event?.ticket_count ?? 0 - (event?.tickets_scanned_count ?? 0),
          style: "border-r px-6 text-peach/90",
        },
      ] as IStatItem[],
    [event?.ticket_count, event?.tickets_scanned_count],
  );

  const TitleSection = useCallback(
    () => (
      <section className="flex w-full flex-col justify-center space-y-1 overflow-clip text-ellipsis">
        <h4 className="font-inter text-xl font-bold capitalize tracking-tight text-chalk shadow-coal drop-shadow-sm">
          {event?.event_name}
        </h4>
        <p className="max-w-[45ch] bg-gradient-to-br from-white/60 via-white/80 to-white/60 bg-clip-text text-tiny font-bold uppercase text-transparent">
          {event?.venue_name ?? event?.event_geo}
        </p>
      </section>
    ),
    [event?.event_geo, event?.venue_name, event?.event_name],
  );
  return (
    <main className="flex h-[calc(100vh-65px)] max-w-md justify-center overflow-hidden bg-gradient-to-t from-coal via-coal to-void">
      <div className="container h-full w-full">
        <div className="h-3/6 md:h-4/6">
          <div className="flex h-20 items-center space-x-4 overflow-hidden border-b-4 border-macl-gray/20 p-2">
            <Image
              src={cover_url ?? "/api/logo"}
              alt={event?.event_name}
              className={cn(
                "aspect-auto h-14 w-16 object-cover object-center",
                {
                  "aspect-video w-auto": cover_url,
                },
              )}
            />
            <TitleSection />
          </div>
          <div className="h-24 w-full">
            <HyperList
              container="h-24 grid w-full grid-cols-3 text-sm tracking-tighter"
              data={stats}
              component={StatItem}
            />
          </div>
        </div>

        <div className="relative z-[60] h-3/6 md:h-2/6">
          <div className="h-4/5" />
          <div className="-mx-1 grid h-6 grid-cols-2">
            <div className="-rotate-[6deg] rounded-tl-3xl border-t-4 border-orange-200/60 bg-peach"></div>
            <div className="rotate-[6deg] rounded-tr-3xl border-t-4 border-orange-200/40 bg-peach"></div>
          </div>
          <div className="relative h-20 w-full bg-gradient-to-tr from-macl-gray/80 via-peach to-peach">
            <div className="absolute -top-4 left-1/4 h-4 w-1/2 bg-peach"></div>
          </div>
        </div>

        <div className="bottom-10 z-50 flex h-16 items-center justify-center">
          <div className="fixed bottom-10 z-[100] flex items-center justify-center rounded-full border-2 border-coal/30 bg-coal/40 p-1.5">
            <button
              onClick={toggle}
              className={cn(
                "relative flex size-16 items-center justify-center rounded-full border-l-[1.66px] border-r-[0.33px] border-t-2 border-macl-gray/40 bg-primary drop-shadow-sm transition-all duration-300 active:scale-90 active:bg-gray-600 active:text-chalk",
                { "border border-teal-200/50": open },
              )}
            >
              <Iconx
                name={open ? "stop-bold" : "qr-code"}
                className={cn("size-7 text-teal-300", {
                  "rounded-[9px] border border-teal-100": open,
                })}
              />
              <Iconx
                name={"spinners-blocks-wave"}
                className={cn(
                  "absolute hidden size-6 rounded-lg text-teal-500",
                  {
                    flex: open,
                  },
                )}
              />
            </button>
          </div>
        </div>

        {open ? (
          <div className="w-md fixed top-0 z-50 h-fit md:left-1/4 md:flex md:h-[36rem] md:w-fit md:justify-center">
            <Scanner ref={scannerRef} on={open} closeFn={closeScanner} />
          </div>
        ) : (
          <div className="fixed bottom-0 z-[60] flex h-10 w-full items-start space-x-3 px-4">
            <Iconx name="dots-six" className="size-5 stroke-0 text-void/80" />
            <div className="rounded-[9px] border-[0.33px] border-void/40 bg-void/20 p-px">
              <div
                className={cn(
                  "size-6 overflow-hidden rounded-lg border border-void/60 bg-void",
                  "",
                )}
              >
                <div className="size-full rounded-[7px] border-l-[0.33px] border-t-[0.33px] border-gray-300/40 bg-gray-600 shadow-inner"></div>
              </div>
            </div>
            {/*  */}
            <div className="rounded-[9px] border-[0.33px] border-void/40 bg-void/20 p-px">
              <div
                className={cn(
                  "size-6 overflow-hidden rounded-lg border border-void/60 bg-void",
                  "",
                )}
              >
                <div className="size-full rounded-[7px] border-l-[0.33px] border-t-[0.33px] border-gray-300/40 bg-gray-500 shadow-inner"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

interface IStatItem {
  title: string;
  value?: number;
  style?: ClassName;
  color?: ClassName;
}
const StatItem = ({ title, value = 0, style, color }: IStatItem) => (
  <div
    className={cn(
      "flex h-full w-full flex-col items-center justify-center space-y-2 border-b border-macl-gray/20",
      style,
    )}
  >
    <span>{title}</span>
    <span className={cn("text-3xl font-bold", color)}>{value}</span>
  </div>
);

export const QrScanView = () => (
  <LiveViewCtxProvider>
    <ScanView />
  </LiveViewCtxProvider>
);
