"use client";

import { getUserID } from "@/app/actions";
import { type XEvent } from "@/app/types";
import { useMoment } from "@/hooks/useMoment";
import { cn } from "@/lib/utils";
import { opts } from "@/utils/helpers";
import { Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { type ButtonHTMLAttributes, useCallback } from "react";
import { type IMenuItem, PopOptions } from "./components";
import { useUserCtx } from "@/app/ctx/user";
import { Iconx } from "@/icons/icon";
import { BtnIcon } from "@/ui/button";

export const CohostedEventCard = (xEvent: XEvent) => {
  const {
    start_date,
    end_date,
    event_id,
    event_geo,
    cover_src,
    event_url,
    event_name,
    is_active,
  } = xEvent;
  const { event_date, event_day, start_time, end_time } = useMoment({
    start: start_date,
    end: end_date,
  });

  const { xUser } = useUserCtx();

  const router = useRouter();
  const handleLiveViewRoute = useCallback(async () => {
    const userId = await getUserID();
    if (!userId) return;
    router.push(`/account/events/l/${event_id}---${userId.split("-").pop()}`);
  }, [router, event_id]);

  const EventButtonOptions = useCallback(() => {
    const options = opts(
      <LiveViewScanner event_id={event_id} onClick={handleLiveViewRoute} />,
      <LiveViewScanner event_id={event_id} onClick={handleLiveViewRoute} />,
    );
    return <>{options.get(is_active ?? false)}</>;
  }, [event_id, is_active, handleLiveViewRoute]);

  const DateTime = useCallback(
    () => (
      <div className="space-x-1 text-tiny uppercase text-gray-200">
        <span className="drop-shadow-md">{event_day.substring(0, 3)}</span>
        <span>&middot;</span>
        <span className="drop-shadow-md">
          {event_date.substring(0, event_date.indexOf(","))}
        </span>
        <span>&middot;</span>
        <span className="drop-shadow-md">
          {start_time.compact}-{end_time.compact}
        </span>
      </div>
    ),
    [event_day, event_date, start_time.compact, end_time.compact],
  );

  const LiveIndicator = useCallback(
    () =>
      is_active && (
        <div className="relative flex size-5 items-center justify-center">
          <Iconx
            name="spinners-pulse-rings-multiple"
            className="absolute size-5 text-teal-400"
          />
        </div>
      ),
    [is_active],
  );

  const CoverImage = useCallback(
    () =>
      cover_src && (
        <Image
          removeWrapper
          radius="none"
          alt="nightlife"
          className="z-0 h-full w-full border-0 object-cover"
          src={cover_src}
        />
      ),
    [cover_src],
  );

  const EventStatus = useCallback(
    () => (
      <span
        className={cn("font-bold uppercase text-teal-400", {
          "font-semibold text-orange-300/80": !is_active,
        })}
      >
        {is_active ? "live" : "not published"}
      </span>
    ),
    [is_active],
  );

  const TitleSection = useCallback(
    () => (
      <section className="w-full overflow-clip text-ellipsis">
        <p className="max-w-[45ch] bg-gradient-to-br from-white/60 via-white/80 to-white/60 bg-clip-text text-tiny font-bold uppercase text-transparent">
          {event_geo ?? event_url}
        </p>
        <h4 className="p-[1px font-inter text-xl font-bold capitalize tracking-tight text-chalk shadow-coal drop-shadow-sm">
          {event_name}
        </h4>
      </section>
    ),
    [event_geo, event_url, event_name],
  );

  const MoreOptions = useCallback(() => {
    const handleAction = async (action: string) => {
      switch (action) {
        case "delete":
          // Handle delete action
          break;
        case "scan":
          // Handle scan action
          break;
        default:
          break;
      }
    };

    const menu = [
      {
        id: 1,
        type: "route",
        label: "Event Settings",
        value: `/account/events/l/${event_id}---${xUser?.id.split("-").pop()}`,
        icon: "pencil-edit-01",
      },
      {
        id: 2,
        type: "route",
        label: "Ticket Scanner",
        value: `/account/events/l/${event_id}---${xUser?.id.split("-").pop()}`,
        icon: "qr-code",
      },
    ] as IMenuItem[];

    return (
      <PopOptions menu={menu} onAction={handleAction}>
        <section className="flex size-8 items-center justify-center">
          <BtnIcon
            icon="settings-01"
            bg="text-chalk opacity-0"
            color="text-chalk"
          />
        </section>
      </PopOptions>
    );
  }, [event_id, xUser?.id]);

  return (
    <Card isFooterBlurred className={cn("h-[300px] w-full")}>
      <CardHeader className="absolute z-10 flex w-full items-start justify-between gap-3 rounded-none bg-black/10 ps-4 backdrop-blur-[1px]">
        <TitleSection />
        <MoreOptions />
      </CardHeader>
      <CoverImage />
      <CardFooter className="absolute bottom-0 z-10 w-full rounded-none border-t-1 border-primary bg-primary">
        <div className="flex flex-grow items-center gap-2 bg-primary">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-tiny">
              <EventStatus />
              <LiveIndicator />
            </div>
            <DateTime />
          </div>
        </div>
        <EventButtonOptions />
      </CardFooter>
    </Card>
  );
};

interface EventButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  event_id?: string;
}

export const EditButton = (props: EventButtonProps) => {
  return (
    <button
      className={cn(
        "flex size-8 items-center justify-center rounded-lg",
        "bg-gray-500/60 hover:bg-teal-400",
        "active:scale-95 active:opacity-90",
        "group/btn transition-all duration-300",
      )}
      {...props}
    >
      <Iconx
        name={"pencil-edit-01"}
        className="size-5 text-chalk shadow-coal drop-shadow-sm group-hover/btn:text-white"
      />
    </button>
  );
};

const LiveViewScanner = (props: EventButtonProps) => {
  return (
    <BtnIcon
      icon="qr-code"
      color="text-indigo-400 size-5"
      bg="text-void opacity-100 size-12"
      {...props}
    />
  );
};
