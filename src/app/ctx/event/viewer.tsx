"use client";

import { useToggle } from "@/hooks/useToggle";
import { type IconName } from "@/icons";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ConvexCtx } from "../convex";
import { getUserID } from "@/app/actions";
import { PreloadedEventsCtx, type UserCounter } from "./preload";

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
}
export const EventViewerCtx = createContext<EventViewerCtxValues | null>(null);

export const EventViewerCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open, toggle } = useToggle();

  const { usr } = use(ConvexCtx)!;
  const { counter, selectedEvent } = use(PreloadedEventsCtx)!;

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
    action: () => T,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    tx(() => {
      set(action());
    });
  };

  const isLiked = useCallback(() => {
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

  const isBookmarked = useCallback(() => {
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
        ? "SpinnerBall"
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
        ? "SpinnerBall"
        : liked
          ? "HeartCheck"
          : ("Heart" as IconName),
      active: liked,
      fn: likeFn,
    }),
    [liked, likeFn, pending],
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

  const value = useMemo(
    () => ({
      open,
      toggle,
      actions,
      bookmarkFn,
      counter,
    }),
    [open, toggle, actions, bookmarkFn, counter],
  );
  return <EventViewerCtx value={value}>{children}</EventViewerCtx>;
};
