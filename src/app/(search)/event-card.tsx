"use client";

import { EventViewerCtx } from "@/app/ctx/event";
import { type SignedEvent } from "@/app/ctx/event/all";
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
import { use, useCallback, useEffect, useState } from "react";

export const EventCard = (event: SignedEvent) => {
  const { event_day, event_time, narrow } = useMoment({
    date: event?.event_date,
    start: event?.start_date,
    end: event?.end_date,
  });
  const { counter, bookmarkFn, incrementViews } = use(EventViewerCtx)!;

  const router = useRouter();

  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBookmarkEvent = useCallback(async () => {
    setBookmarked((prev) => !prev);
    await bookmarkFn();
  }, [bookmarkFn]);

  const handleSelectEvent = useCallback(async () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    await incrementViews();
    router.push(`/?x=${event.event_id}`, { scroll: false });
    return () => clearTimeout(timer);
  }, [event?.event_id, incrementViews, router]);

  useEffect(() => {
    setBookmarked(counter?.bookmarks?.includes(event?.event_id) ?? false);
  }, [counter?.bookmarks, event]);

  const BookmarkButton = useCallback(
    () => (
      <ButtonIcon
        icon={bookmarked ? "BookmarkCheck" : "BookmarkPlus"}
        bg={bookmarked ? "text-teal-500 opacity-100" : "opacity-20"}
        shadow={bookmarked ? "text-coal opacity-100" : ""}
        color={bookmarked ? "text-white fill-white" : ""}
        onClick={handleBookmarkEvent}
      />
    ),
    [handleBookmarkEvent, bookmarked],
  );

  return (
    <Card
      isFooterBlurred
      className="h-[300px] w-full overflow-hidden rounded-3xl border border-primary-700 bg-primary-700"
    >
      <CardHeader
        className={cn(
          "absolute top-1 z-10 flex w-full items-start justify-between gap-3 ps-4 text-white",
          { "text-coal": event?.is_cover_light },
        )}
      >
        <section className="w-full overflow-clip text-ellipsis">
          <p className="max-w-[35ch] whitespace-nowrap bg-gradient-to-br from-white/60 from-20% via-white/80 via-15% to-white/70 to-40% bg-clip-text text-tiny font-bold uppercase text-transparent">
            {event.venue_name ?? event.event_geo}
          </p>
          <h4 className="p-[1px font-inter text-xl font-bold capitalize tracking-tight shadow-coal drop-shadow-sm">
            {event.event_name}
          </h4>
        </section>
        <section className="relative flex size-8 items-center justify-center">
          <div className="absolute -right-8 -top-10">
            <Heart isActive={bookmarked} />
          </div>
          <BookmarkButton />
        </section>
      </CardHeader>
      {event.cover_src ? (
        <Image
          removeWrapper
          radius="none"
          alt="nightlife"
          className="z-0 aspect-auto h-full w-full border-0 object-cover object-top"
          src={event.cover_src}
        />
      ) : null}
      <CardFooter className="absolute -bottom-[2px] z-10 border-t-[0.33px] border-primary/40 bg-black/10">
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
                {/* {event_date.substring(0, event_date.indexOf(","))} */}
                {narrow.date}
              </span>
              <span>&middot;</span>
              <span className="drop-shadow-md">{event_time.compact}</span>
            </div>
          </div>
        </div>
        <button
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
            <Icon
              name="ArrowRight"
              className="size-4 animate-enter text-chalk shadow-coal drop-shadow-sm group-hover/btn:text-white"
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
