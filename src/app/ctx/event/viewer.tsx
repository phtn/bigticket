"use client";

import { type InfoItem } from "@/app/_components_/event-viewer/components";
import { fetchEventById, getUserID } from "@/app/actions";
import { useMoment } from "@/hooks/useMoment";
import { useToggle } from "@/hooks/useToggle";
import { type IconName } from "@/icons";
import { type SelectEvent } from "convex/events/d";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type TransitionStartFunction,
} from "react";
import { ConvexCtx } from "../convex";
import { PreloadedEventsCtx, type UserCounter } from "./preload";
import { TicketCtxProvider } from "./ticket";

export interface ActionParams {
  event_id?: string;
  event_name?: string;
}

export interface ActionItem {
  id: number;
  label: string;
  icon: IconName;
  active: boolean;
  fn: () => Promise<void>;
}
interface EventViewerCtxValues {
  toggle: VoidFunction;
  open: boolean;
  actions: ActionItem[];
  bookmarkFn: () => Promise<void>;
  counter: UserCounter | null;
  incrementViews: () => Promise<void>;
  activeEvent: SelectEvent | null;
  activeEventInfo: InfoItem[];
  cover_src: string | null;
  moments: {
    start_time: { full: string; compact: string };
    narrow: { day: string; date: string };
  };
  isTicketClaimed: boolean;
}
export const EventViewerCtx = createContext<EventViewerCtxValues | null>(null);

export const EventViewerCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open, toggle } = useToggle();
  const { counter, selectedEvent } = use(PreloadedEventsCtx)!;
  const { usr, events } = use(ConvexCtx)!;

  const [activeEvent, setActiveEvent] = useState<SelectEvent | null>(null);
  const [isTicketClaimed, setIsTicketClaimed] = useState<boolean>(false);

  const { start_time, narrow, event_time, durationHrs, compact } = useMoment({
    date: activeEvent?.event_date ?? selectedEvent?.event_date,
    start: activeEvent?.start_date ?? selectedEvent?.start_date,
    end: activeEvent?.end_date ?? selectedEvent?.end_date,
  });

  const moments = useMemo(() => ({ start_time, narrow }), [start_time, narrow]);

  const getEventUpdate = useCallback(async () => {
    if (!selectedEvent) return null;
    return (await fetchEventById(selectedEvent.event_id)) as SelectEvent;
  }, [selectedEvent]);

  const incrementViews = useCallback(async () => {
    if (!selectedEvent) return;
    await events.update.views(selectedEvent.event_id);
  }, [selectedEvent, events.update]);

  const actionParams: ActionParams = useMemo(
    () => ({
      event_name: selectedEvent?.event_name,
      event_id: selectedEvent?.event_id,
    }),
    [selectedEvent],
  );
  const shareData: ShareData = useMemo(
    () => ({
      title: selectedEvent?.event_name,
      text: selectedEvent?.event_id,
      url: selectedEvent?.event_url,
    }),
    [selectedEvent],
  );

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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

  const getActiveEvent = useCallback(() => {
    setFn(fn, getEventUpdate, setActiveEvent);
  }, [getEventUpdate]);

  useEffect(() => {
    getActiveEvent();
    console.log(bookmarked ? "" : ".", liked ? "" : ".");
  }, [getActiveEvent, bookmarked, liked]);

  const isLiked = useCallback(async () => {
    if (counter?.likes && selectedEvent?.event_id) {
      return counter.likes.includes(selectedEvent.event_id);
    }
    return false;
  }, [counter?.likes, selectedEvent]);

  const isLikeActive = useCallback(() => {
    setFn(fn, isLiked, setLiked);
  }, [isLiked]);

  useEffect(() => {
    isLikeActive();
  }, [isLikeActive]);

  const isBookmarked = useCallback(async () => {
    if (counter?.bookmarks && selectedEvent?.event_id) {
      return counter.bookmarks.includes(selectedEvent.event_id);
    }
    return false;
  }, [counter?.bookmarks, selectedEvent]);

  const isBookmarkActive = useCallback(() => {
    setFn(fn, isBookmarked, setBookmarked);
  }, [isBookmarked]);

  useEffect(() => {
    isBookmarkActive();
  }, [isBookmarkActive]);

  const checkTicketClaim = useCallback(async () => {
    if (counter?.tickets && selectedEvent?.event_id) {
      return (
        counter.tickets.findIndex(
          (ticket) => ticket.event_id === selectedEvent.event_id,
        ) !== -1
      );
    }
    return false;
  }, [counter?.tickets, selectedEvent]);

  const isClaimed = useCallback(() => {
    setFn(fn, checkTicketClaim, setIsTicketClaimed);
  }, [checkTicketClaim]);

  useEffect(() => {
    isClaimed();
  }, [isClaimed]);

  const handleClickSupport = useCallback(async () => {
    console.log("support");
  }, []);

  const handleClickGeo = useCallback(async () => {
    console.log("geo");
  }, []);

  const handleClickWebsite = useCallback(async () => {
    console.log("website");
  }, []);

  const bookmarkFn = useCallback(async () => {
    const id = await getUserID();
    if (!id || !actionParams.event_id) return;
    setBookmarked((prev) => !prev);
    await usr.update.bookmarks(id, actionParams.event_id);
  }, [usr.update, actionParams]);

  const likeFn = useCallback(async () => {
    const id = await getUserID();
    if (!id || !actionParams.event_id) return;
    setLiked((prev) => !prev);
    await usr.update.likes(id, actionParams.event_id);
  }, [usr.update, actionParams]);

  const handleClickShare = useCallback(async () => {
    try {
      await navigator.share(shareData);
    } catch (e) {
      if (e instanceof Error) {
        console.log(
          e.name === "AbortError"
            ? "Share action canceled by user."
            : e.message,
        );
      }
    }
  }, [shareData]);

  const bookmarkItem = useMemo(
    () => ({
      id: 3,
      label: "bookmark",
      icon: pending
        ? "SpinnerClock"
        : bookmarked
          ? "BookmarkCheck"
          : ("BookmarkPlus" as IconName),
      active: bookmarked ?? false,
      fn: bookmarkFn,
    }),
    [bookmarked, bookmarkFn, pending],
  );

  const likeItem = useMemo(
    () => ({
      id: 4,
      label: "like",
      icon: pending
        ? "SpinnerClock"
        : liked
          ? "HeartCheck"
          : ("Heart" as IconName),
      active: liked,
      fn: likeFn,
    }),
    [liked, likeFn, pending],
  );

  const activeEventInfo: InfoItem[] = useMemo(
    () => [
      {
        label: "Ticket Sales",
        value: activeEvent?.is_private ? "EXCLUSIVE" : "OPEN",
      },
      {
        label: activeEvent?.is_private ? "Tickets Claimed" : "Tickets Sold",
        value: activeEvent?.tickets_sold ?? 0,
      },
      { label: "Tickets Remaining", value: "50" },
      { label: "Date", value: compact },
      { label: "Time", value: event_time.compact },
      { label: "Duration", value: `${durationHrs?.toFixed(1)} hours` },
      { label: "Likes", value: activeEvent?.likes ?? 0 },
      { label: "Views", value: activeEvent?.views ?? 0 },
      { label: "Bookmarks", value: activeEvent?.bookmarks ?? 0 },
    ],
    [
      activeEvent?.views,
      activeEvent?.likes,
      activeEvent?.bookmarks,
      activeEvent?.is_private,
      activeEvent?.tickets_sold,
      event_time,
      durationHrs,
      compact,
    ],
  );

  const actions: ActionItem[] = useMemo(
    () => [
      {
        id: 0,
        label: "support",
        icon: "Support",
        active: false,
        fn: handleClickSupport,
      },
      {
        id: 1,
        label: "geolocation",
        icon: "MapPin",
        active: false,
        fn: handleClickGeo,
      },
      {
        id: 2,
        label: "website",
        icon: "Globe",
        active: false,
        fn: handleClickWebsite,
      },
      bookmarkItem,
      likeItem,
      {
        id: 5,
        label: "share",
        icon: "Share",
        active: false,
        fn: handleClickShare,
      },
    ],
    [
      handleClickSupport,
      handleClickGeo,
      handleClickWebsite,
      handleClickShare,
      bookmarkItem,
      likeItem,
    ],
  );
  const cover_src = selectedEvent?.cover_src ?? null;

  const value = useMemo(
    () => ({
      open,
      toggle,
      actions,
      bookmarkFn,
      counter,
      incrementViews,
      activeEvent,
      activeEventInfo,
      moments,
      cover_src,
      isTicketClaimed,
    }),
    [
      open,
      toggle,
      actions,
      bookmarkFn,
      counter,
      incrementViews,
      activeEvent,
      activeEventInfo,
      moments,
      cover_src,
      isTicketClaimed,
    ],
  );
  return (
    <EventViewerCtx value={value}>
      <TicketCtxProvider>{children}</TicketCtxProvider>
    </EventViewerCtx>
  );
};
