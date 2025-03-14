import { bookmarkEvent, likeEvent } from "@/app/account/(tabs)/events/actions";
import { getUserID } from "@/app/actions";
import { useUserCtx } from "@/app/ctx/user";
import { type XEvent } from "@/app/types";
import { useMoment } from "@/hooks/useMoment";
import { type IconName } from "@/icons/types";
import { Err } from "@/utils/helpers";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface InfoItem {
  label: string;
  value: string | number;
}

export interface PanelItem {
  id: number;
  label: string;
  icon: IconName;
  active: boolean;
  fn: () => Promise<void>;
}

export const useEventInfo = (xEvent: XEvent | undefined) => {
  const [userId, setUserId] = useState<string | null>(null);

  const getUserId = useCallback(async () => {
    try {
      const id = await getUserID();
      setUserId(id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getUserId().catch(Err);
  }, [getUserId]);

  const {
    event_id,
    is_private,
    likes,
    bookmarks,
    start_date,
    end_date,
    views,
    tickets_sold,
  } = xEvent ?? {};

  const { compact, event_time, durationHrs } = useMoment({
    start: start_date,
    end: end_date,
  });

  const { xUser } = useUserCtx();

  const isBookmarked = useMemo(() => {
    if (!event_id) return false;
    return xUser?.bookmarks?.includes(event_id) ?? false;
  }, [xUser, event_id]);

  const xEventInfo: InfoItem[] = useMemo(
    () => [
      {
        label: "Ticket Sales",
        value: is_private ? "PRIVATE EVENT" : "OPEN",
      },
      {
        label: is_private ? "Tickets Claimed" : "Tickets Sold",
        value: tickets_sold ?? 0,
      },
      { label: "Tickets Remaining", value: "50" },
      { label: "Date", value: compact },
      { label: "Time", value: event_time.compact },
      { label: "Duration", value: getDuration(durationHrs) },
      { label: "Likes", value: likes ?? 0 },
      { label: "Views", value: views ?? 0 },
      { label: "Bookmarks", value: bookmarks ?? 0 },
    ],
    [
      views,
      likes,
      bookmarks,
      is_private,
      tickets_sold,
      event_time,
      durationHrs,
      compact,
    ],
  );

  const toggleLike = useCallback(async () => {
    if (userId && event_id) {
      await likeEvent(userId, event_id);
    }
  }, [event_id, userId]);

  const toggleBookmark = useCallback(async () => {
    if (userId && event_id) {
      await bookmarkEvent(userId, event_id);
    }
  }, [event_id, userId]);

  const bookmarkItem = useMemo(
    () => ({
      id: 3,
      label: "bookmark",
      icon: bookmarks ? "bookmark-add-02" : "bookmark",
      active: !!bookmarks,
      fn: toggleBookmark,
    }),
    [bookmarks, toggleBookmark],
  );

  const likeItem = useMemo(
    () =>
      ({
        id: 4,
        label: "like",
        icon: likes ? "heart-check" : "heart-add",
        active: !!likes,
        fn: toggleLike,
      }) as PanelItem,
    [likes, toggleLike],
  );

  const panelItems = useMemo(
    () =>
      [
        {
          id: 0,
          label: "support",
          icon: "customer-support",
          active: false,
          fn: async () => console.log("support clicked"),
        },
        {
          id: 1,
          label: "geolocation",
          icon: "location-04",
          active: false,
          fn: async () => console.log("geolocation clicked"),
        },
        {
          id: 2,
          label: "website",
          icon: "globe",
          active: false,
          fn: async () => console.log("website clicked"),
        },
        bookmarkItem,
        likeItem,
        {
          id: 5,
          label: "share",
          icon: "share",
          active: false,
          fn: async () => console.log("share clicked"),
        },
      ] as PanelItem[],
    [bookmarkItem, likeItem],
  );

  return { xEventInfo, panelItems, toggleBookmark, isBookmarked };
};

const getDuration = (duration: number | undefined) => {
  if (!duration) return "0 hours";
  return duration % +duration.toFixed(2) === 0
    ? `${duration} hour${duration > 1 ? "s" : ""}`
    : `${duration.toFixed(0)} hour${duration > 1 ? "s " : " "} ${+(duration % +duration.toFixed(2)).toFixed(2) * 60}m`;
};
