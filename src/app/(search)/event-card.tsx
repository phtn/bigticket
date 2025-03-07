"use client";

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
import { useCallback, useState } from "react";
import { type XEvent } from "../types";

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

  // const { incrementViews } = use(EventViewerCtx)!;

  const router = useRouter();

  // const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // const handleBookmarkEvent = useCallback(async () => {
  //   setBookmarked((prev) => !prev);
  //   await bookmarkFn();
  // }, [bookmarkFn]);

  const handleSelectEvent = useCallback(async () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    // await incrementViews();
    router.push(`/?x=${event_id}`, { scroll: false });
    return () => clearTimeout(timer);
  }, [event_id, router]);

  // useEffect(() => {
  //   setBookmarked(counter?.bookmarks?.includes(event?.event_id) ?? false);
  // }, [counter?.bookmarks, event]);

  const BookmarkButton = useCallback(
    () => (
      <ButtonIcon
        aria-label={`bookmark-${event_name?.replaceAll(" ", "-").toLowerCase()}`}
        icon={false ? "BookmarkCheck" : "BookmarkPlus"}
        bg={false ? "text-teal-500 opacity-100" : "opacity-20"}
        shadow={false ? "text-coal opacity-100" : ""}
        color={false ? "text-white fill-white" : ""}
        onClick={() => console.log("bookmark")}
      />
    ),
    [event_name],
  );

  return (
    <Card
      isFooterBlurred
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
              "max-w-[35ch] whitespace-nowrap text-tiny font-bold uppercase",
              "bg-gradient-to-br bg-clip-text text-transparent",
              "from-white/60 from-20% via-white/80 via-15% to-white/70 to-40%",
              {
                "from-ticket/80 from-20% via-ticket/80 via-15% to-ticket/90 to-40%":
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
                "absolute -left-2 w-fit rounded-e-full bg-white py-0.5 pe-3 ps-6 text-primary opacity-100 shadow-white":
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
          isZoomed
          removeWrapper
          radius="none"
          alt="nightlife"
          className="z-0 aspect-auto h-full w-full border-0 object-cover object-top"
          src={cover_src}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Icon name="SpinnerBall" className="size-8 text-teal-300" />
        </div>
      )}
      <CardFooter className="absolute -bottom-[2px] z-10 border-t-[0.33px] border-primary/40 bg-black/10">
        <div className="flex flex-grow items-center gap-2">
          {/* <Image
            alt="Breathing app icon"
            className="h-24 w-full rounded-full"
            src={cover_url}
          /> */}
          <div className="space-y-0.5">
            <p className="text-tiny font-semibold text-teal-300 drop-shadow-md">
              {host_name}
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
