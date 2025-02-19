"use client";

import { getUserID } from "@/app/actions";
import { type SignedEvent } from "@/app/ctx/event/preload";
import { useMoment } from "@/hooks/useMoment";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { ButtonIcon } from "@/ui/button";
import { opts } from "@/utils/helpers";
import { Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { type ButtonHTMLAttributes, useCallback } from "react";

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

  const handleLiveViewRoute = useCallback(async () => {
    const userId = await getUserID();
    if (!userId) return;
    router.push(
      `/account/events/l/${event.event_id}---${userId.split("-").pop()}`,
    );
  }, [router, event.event_id]);

  const EventButtonOptions = useCallback(() => {
    const options = opts(
      <LiveViewButton
        event_id={event?.event_id}
        onClick={handleLiveViewRoute}
      />,
      <EditButton event_id={event?.event_id} onClick={handleEditRoute} />,
    );
    return <>{options.get(event?.is_active ?? false)}</>;
  }, [event?.event_id, handleEditRoute, handleLiveViewRoute, event?.is_active]);

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
          <h4 className="p-[1px font-inter text-xl font-bold capitalize tracking-tight text-chalk shadow-coal drop-shadow-sm">
            {event.event_name}
          </h4>
        </section>
        <section className="flex size-8 items-center justify-center">
          <ButtonIcon
            icon="ChartIcon"
            bg="text-chalk opacity-20"
            color="text-chalk"
          />
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
            <div className="flex items-center gap-1 text-tiny">
              <span
                className={cn("font-bold uppercase text-teal-400", {
                  "font-light text-peach": !event?.is_active,
                })}
              >
                {event.is_active ? "live" : "not published"}
              </span>
              <div className="relative flex size-5 items-center justify-center">
                <Icon
                  name="SpinnersPulseRing"
                  className="absolute size-5 text-teal-400"
                />
                <Icon name="DotSm" className="absolute size-4 text-teal-400" />
              </div>
            </div>
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
        <EventButtonOptions />
      </CardFooter>
    </Card>
  );
};

interface EventButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  event_id?: string;
}

const EditButton = (props: EventButtonProps) => {
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
      <Icon
        name={"Pen"}
        className="size-5 text-chalk shadow-coal drop-shadow-sm group-hover/btn:text-white"
      />
    </button>
  );
};

const LiveViewButton = (props: EventButtonProps) => {
  return (
    <ButtonIcon
      icon="Play"
      color="text-teal-400 size-5"
      bg="text-void opacity-100 size-12"
      {...props}
    />
  );
};
