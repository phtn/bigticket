"use client";

import { useMoment } from "@/hooks/useMoment";
import { cn } from "@/lib/utils";
import {
  Card,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { type XEvent } from "../types";
import { Iconx } from "@/icons";
import { BtnIcon } from "@/ui/button/button-icon";

export const EventCard = (xEvent: XEvent) => {
  const { event_day, event_time, narrow } = useMoment({
    start: xEvent.start_date,
    end: xEvent.end_date,
  });
  const {
    cover_src,
    event_id,
    host_name,
    venue_name,
    event_geo,
    event_name,
    is_cover_light,
  } = xEvent;

  const router = useRouter();

  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBookmarkEvent = useCallback(async () => {
    console.log(event_id);
    setBookmarked(true);
  }, [event_id]);

  const handleSelectEvent = useCallback(async () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    router.push(`/?x=${event_id}`, { scroll: false });
    return () => clearTimeout(timer);
  }, [event_id, router]);

  const BookmarkButton = useCallback(
    () => (
      <BtnIcon
        aria-label={`bookmark-${event_name?.replaceAll(" ", "-").toLowerCase()}`}
        icon={bookmarked ? "bookmark-check-02" : "bookmark-add-02"}
        bg={bookmarked ? "text-teal-500 opacity-100" : "opacity-20"}
        shadow={bookmarked ? "text-coal opacity-100" : ""}
        color={bookmarked ? "text-white fill-white" : ""}
        onClick={handleBookmarkEvent}
      />
    ),
    [event_name, handleBookmarkEvent, bookmarked],
  );

  return (
    <Card
      isFooterBlurred
      disableAnimation
      className="h-[300px] w-full overflow-clip rounded-3xl border border-primary-700 bg-primary"
    >
      <CardHeader
        className={cn(
          "absolute top-1 z-10 flex w-full items-start justify-between gap-3 ps-4 tracking-tight text-white",
          { "text-coal": is_cover_light },
        )}
      >
        <section className="w-full overflow-clip text-ellipsis">
          <h2
            className={cn(
              "max-w-[35ch] whitespace-nowrap font-sans text-xs font-semibold uppercase",
              "bg-gradient-to-br bg-clip-text text-transparent",
              "from-white/60 from-20% via-white/80 via-15% to-white/70 to-40%",
              {
                "from-ticket from-20% via-void/80 via-15% to-ticket to-40% font-semibold":
                  is_cover_light,
              },
            )}
          >
            {venue_name ?? event_geo}
          </h2>
          <h1
            className={cn(
              "font-inter text-xl font-bold capitalize tracking-tight shadow-coal drop-shadow-sm",
              {
                "absolute -left-2 w-fit rounded-e-full bg-white/20 py-0.5 pe-3 ps-6 text-primary opacity-100 shadow-white backdrop-blur":
                  is_cover_light,
              },
            )}
          >
            {event_name}
          </h1>
        </section>
        <section className="relative flex size-8 items-center justify-center">
          <div className="absolute -right-8 -top-10">
            <Heart isActive={false} />
          </div>
          <BookmarkButton />
        </section>
      </CardHeader>
      {cover_src ? (
        <Image
          isBlurred
          removeWrapper
          radius="none"
          alt="nightlife"
          className="z-0 aspect-auto h-full w-full border-0 object-cover object-top"
          src={cover_src}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Iconx
            name="spinners-bouncing-ball"
            className="size-8 text-teal-300"
          />
        </div>
      )}
      <CardFooter className="absolute -bottom-[2px] z-10 border-t-[0.33px] border-primary/40 bg-black/10">
        <div className="flex flex-grow items-center gap-2">
          <div className="space-y-0.5">
            <p className="text-tiny font-semibold text-teal-300 drop-shadow-md">
              {host_name}
            </p>
            <div className="space-x-2 text-tiny font-bold uppercase text-chalk">
              <span className="drop-shadow-md">{event_day}</span>
              <span>&middot;</span>
              <span className="drop-shadow-md">{narrow.date}</span>
              <span>&middot;</span>
              <span className="drop-shadow-md">{event_time.compact}</span>
            </div>
          </div>
        </div>
        <button
          aria-label={`view-${event_name?.replaceAll(" ", "-").toLowerCase()}-event`}
          onClick={handleSelectEvent}
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            "bg-teal-500 hover:bg-teal-400",
            "active:scale-95 active:opacity-90",
            "group/btn transition-all duration-300",
          )}
        >
          {loading ? (
            <Spinner size="sm" color="default" />
          ) : (
            <Iconx
              name="arrow-right-02"
              className="size-5 text-coal shadow-coal drop-shadow-sm"
            />
          )}
        </button>
      </CardFooter>
    </Card>
  );
};

export interface HeartProp {
  isActive: boolean;
}

export const Heart = ({ isActive }: HeartProp) => {
  return (
    <button
      style={{
        backgroundPosition: isActive ? "-2799px 7px" : "0px 7px",
        transition: isActive ? "background 0.75s steps(28)" : "",
        display: "inline-block",
      }}
      className={cn(
        "size-[99px] scale-75 bg-[url('/png/heart.png')] bg-no-repeat opacity-0",
        { "opacity-100": isActive },
      )}
    ></button>
  );
};
