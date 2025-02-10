"use client";

import { useToggle } from "@/hooks/useToggle";
import { type IconName } from "@/icons";
import { createContext, useCallback, useMemo, type ReactNode } from "react";

type ActionParams = string | number | object;

export interface ActionItem {
  id: number;
  label: string;
  icon: IconName;
  active: boolean;
  fn: (value: ActionParams) => () => Promise<void>;
}
interface EventViewerCtxValues {
  toggle: VoidFunction;
  open: boolean;
  actions: ActionItem[];
}
export const EventViewerCtx = createContext<EventViewerCtxValues | null>(null);

export const EventViewerCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { open, toggle } = useToggle();

  const handleClickSupport = useCallback(
    (value: ActionParams) => async () => {
      console.log(value);
    },
    [],
  );

  const handleClickGeo = useCallback(
    (value: ActionParams) => async () => {
      console.log(value);
    },
    [],
  );

  const handleClickWebsite = useCallback(
    (value: ActionParams) => async () => {
      console.log(value);
    },
    [],
  );
  const handleClickBookmark = useCallback(
    (value: ActionParams) => async () => {
      console.log(value);
    },
    [],
  );
  const handleClickLike = useCallback(
    (value: ActionParams) => async () => {
      console.log(value);
    },
    [],
  );
  const handleClickShare = useCallback(
    (value: ActionParams) => async () => {
      try {
        await navigator.share(value as ShareData);
      } catch (e) {
        if (e instanceof Error) {
          console.log(
            e.name === "AbortError"
              ? "Share action canceled by user."
              : e.message,
          );
        }
      }
    },
    [],
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
      {
        id: 3,
        label: "bookmark",
        icon: "BookmarkPlus",
        active: false,
        fn: handleClickBookmark,
      },
      {
        id: 4,
        label: "like",
        icon: "Heart",
        active: false,
        fn: handleClickLike,
      },
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
      handleClickBookmark,
      handleClickLike,
      handleClickShare,
    ],
  );

  const value = useMemo(
    () => ({
      open,
      toggle,
      actions,
    }),
    [open, toggle, actions],
  );
  return <EventViewerCtx value={value}>{children}</EventViewerCtx>;
};
