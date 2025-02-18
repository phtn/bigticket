"use client";

import { EventViewerCtx } from "@/app/ctx/event";
import { PreloadedEventsCtx, type SignedEvent } from "@/app/ctx/event/preload";
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
import { use, useCallback, useEffect, useState } from "react";

const isLightColor = (r: number | undefined, g: number | undefined, b: number | undefined) => {
  // Calculate the luminance of the color
  const luminance = 0.299 * (r ?? 0) + 0.587 * (g ?? 0) + 0.114 * (b ?? 0);
  return luminance > 186; // A threshold value to determine if the color is light
};

export const EventCard = (event: SignedEvent) => {
  const { event_day, event_time, narrow } = useMoment({
    date: event?.event_date,
    start: event?.start_date,
    end: event?.end_date,
  });
  const { getEvent } = use(PreloadedEventsCtx)!;
  const { toggle, counter, bookmarkFn, incrementViews } = use(EventViewerCtx)!;

  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [textColor, setTextColor] = useState("#000");

  const handleBookmarkEvent = useCallback(async () => {
    setBookmarked((prev) => !prev);

    await bookmarkFn();
  }, [bookmarkFn]);

  const handleSelectEvent = useCallback(async () => {
    getEvent(event.event_id);
    toggle();
    await incrementViews();
  }, [getEvent, event?.event_id, toggle, incrementViews]);

  useEffect(() => {
    setBookmarked(counter?.bookmarks?.includes(event?.event_id) ?? false);
  }, [counter?.bookmarks, event]);

  useEffect(() => {
    if (event.cover_src) {
      const img = document.createElement('img');
      img.src = event.cover_src;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const topleft = ctx.getImageData(0, 0, 200, 20); // Get the color of the top-left pixel
          const [r, g, b] = topleft.data;
          setTextColor(isLightColor(r, g, b) ? "#000" : "#fff");
        }
      };
    }
  }, [event.cover_src]);

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
      className="h-[280px] w-full overflow-hidden rounded-3xl border border-primary-700 bg-primary-700"
    >
      <CardHeader className="absolute top-1 z-10 flex w-full items-start justify-between gap-3 ps-4" style={{ color: textColor }}>
        <section className="w-full overflow-clip text-ellipsis">
          <p className="max-w-[35ch] whitespace-nowrap text-tiny font-bold uppercase" style={{ color: textColor }}>
            {event.event_geo ?? event.event_url}
          </p>
          <h4 className="p-[1px font-inter text-xl font-bold capitalize tracking-tight shadow-coal drop-shadow-sm" style={{ color: textColor }}>
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
          {!event ? (
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
