"use client";

import { ConvexCtx } from "@/app/ctx/convex";
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
import type { SelectEvent } from "convex/events/d";
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  use,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";

export const EventCard = (event: SelectEvent) => {
  const [cover_url, setCoverURL] = useState<string | null>(null);
  const { files } = use(ConvexCtx)!;

  const createUrl = useCallback(async () => {
    if (!event.cover_url) return null;
    return await files.get(event.cover_url);
  }, [files, event.cover_url]);

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

  const generateURL = useCallback(() => {
    setFn(fn, createUrl, setCoverURL);
  }, [createUrl]);

  useEffect(() => {
    generateURL();
  }, [generateURL]);

  const { event_date, event_day } = useMoment({ date: event?.event_date });

  return (
    <Card
      isFooterBlurred
      className="h-[280px] w-full rounded-2xl border border-primary-700"
    >
      <CardHeader className="absolute top-1 z-10 flex w-full items-start justify-between gap-3 ps-4">
        <section className="w-full overflow-clip text-ellipsis">
          <p className="max-w-[45ch] bg-gradient-to-b from-white/60 via-white/80 to-white/60 bg-clip-text text-tiny font-bold uppercase text-transparent">
            {event.event_geo ?? event.event_url}
          </p>
          <h4 className="p-[1px bg-gradient-to-b from-white via-white/80 to-amber-200/70 bg-clip-text font-inter text-xl font-bold capitalize tracking-tight text-transparent shadow-coal drop-shadow-sm">
            {event.event_name}
          </h4>
        </section>
        <section className="flex size-8 items-center justify-center">
          <ButtonIcon icon="BookmarkPlus" bg="text-chalk" />
        </section>
      </CardHeader>
      {cover_url ? (
        <Image
          removeWrapper
          radius="none"
          alt="nightlife"
          className="z-0 h-full w-full border-0 object-cover"
          src={cover_url}
        />
      ) : null}
      <CardFooter className="absolute bottom-0 z-10 border-t-1 border-primary/60 bg-black/40">
        <div className="flex flex-grow items-center gap-2">
          {/* <Image
            alt="Breathing app icon"
            className="h-24 w-full rounded-full"
            src={cover_url}
          /> */}
          <div className="space-y-0.5">
            <p className="text-tiny font-semibold text-teal-300 drop-shadow-md">
              {event.host_name}
            </p>
            <div className="space-x-2 text-tiny font-bold uppercase text-chalk">
              <span className="drop-shadow-md">{event_day}</span>
              <span>&middot;</span>
              <span className="drop-shadow-md">
                {event_date.substring(0, event_date.indexOf(","))}
              </span>
              <span>&middot;</span>
              <span className="drop-shadow-md">9pm-3am</span>
            </div>
          </div>
        </div>
        <button
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            "bg-teal-500 hover:bg-teal-400",
            "active:scale-95 active:opacity-90",
            "group/btn transition-all duration-300",
          )}
        >
          {pending ? (
            <Spinner size="sm" color="default" />
          ) : (
            <Icon
              name="ArrowRight"
              className="size-4 text-chalk shadow-coal drop-shadow-sm group-hover/btn:text-white"
            />
          )}
        </button>
      </CardFooter>
    </Card>
  );
};
