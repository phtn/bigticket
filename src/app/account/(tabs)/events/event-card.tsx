"use client";

import { getUserID } from "@/app/actions";
import { type SignedEvent } from "@/app/ctx/event/preload";
import { useMoment } from "@/hooks/useMoment";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const EventCardAccount = (event: SignedEvent) => {
  const { event_date, event_day, start_time, end_time } = useMoment({
    date: event?.event_date,
    start: event?.start_date,
    end: event?.end_date,
  });

  const router = useRouter();
  const handleEditRoute = useCallback(async () => {
    const userId = await getUserID();
    if (!userId) return;
    router.push(`/account/events/e/${event.event_id}---${userId}`);
  }, [router, event.event_id]);

  return (
    <Card
      isFooterBlurred
      className="h-[280px] w-full rounded-md border border-primary bg-primary"
    >
      <CardHeader className="absolute z-10 flex w-full items-start justify-between gap-3 rounded-none bg-black/40 ps-4 backdrop-blur-sm">
        <section className="w-full overflow-clip text-ellipsis">
          <p className="max-w-[45ch] bg-gradient-to-br from-white/60 via-white/80 to-white/60 bg-clip-text text-tiny font-bold uppercase text-transparent">
            {event.event_geo ?? event.event_url}
          </p>
          <h4 className="p-[1px font-inter text-xl text-chalk font-bold capitalize tracking-tight shadow-coal drop-shadow-sm">
            {event.event_name}
          </h4>
        </section>
        <section className="flex size-8 items-center justify-center">
          <ButtonIcon icon="ChartIcon" bg="text-chalk opacity-20" color="text-chalk" />
        </section>
      </CardHeader>
      {event.cover_src ? (
        <Image
          removeWrapper
          radius="none"
          alt="nightlife"
          className="z-0 h-full w-full border-0 object-cover"
          src={event.cover_src}
        />
      ) : null}
      <CardFooter className="absolute bottom-0 z-10 w-full rounded-none border-t-1 border-primary bg-primary">
        <div className="flex flex-grow items-center gap-2 bg-primary">
          {/* <Image
            alt="Breathing app icon"
            className="h-24 w-full rounded-full"
            src={cover_url}
          /> */}
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-tiny capitalize text-secondary drop-shadow-sm">
              <span
                className={cn("lowercase text-chalk", {
                  "text-peach": !event?.is_active,
                })}
              >
                {event.is_active ? "live" : "not published"}
              </span>
            </p>
            <div className="space-x-1 text-tiny uppercase text-gray-200">
              <span className="drop-shadow-md">
                {event_day.substring(0, 3)}
              </span>
              <span>&middot;</span>
              <span className="drop-shadow-md">
                {event_date.substring(0, event_date.indexOf(","))}
              </span>
              <span>&middot;</span>
              <span className="drop-shadow-md">
                {start_time.compact}-{end_time.compact}
              </span>
            </div>
          </div>
        </div>
        <button
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            "bg-gray-500/60 hover:bg-teal-400",
            "active:scale-95 active:opacity-90",
            "group/btn transition-all duration-300",
          )}
          disabled={!event}
          onClick={handleEditRoute}
        >
          {!event ? (
            <Spinner size="sm" color="default" />
          ) : (
            <Icon
              name="Pen"
              className="size-5 text-chalk shadow-coal drop-shadow-sm group-hover/btn:text-white"
            />
          )}
        </button>
      </CardFooter>
    </Card>
  );
};
