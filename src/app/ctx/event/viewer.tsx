"use client";

import { useToggle } from "@/hooks/useToggle";
import { type IconName } from "@/icons";
import { createContext, useCallback, useMemo, type ReactNode } from "react";

export interface ActionItem {
  id: number;
  label: string;
  icon: IconName;
  value?: string[];
  active: boolean;
  fn: (value?: string | number) => () => void | undefined;
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
    (value?: string | number) => () => {
      console.log(value);
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
        value: [
          "J2RM+3G Quezon City, Metro Manila",
          "14.640341880412146, 121.03372227344987",
        ],
        active: false,
        fn: handleClickSupport,
      },
      {
        id: 2,
        label: "website",
        icon: "Globe",
        active: false,
        fn: handleClickSupport,
      },
      {
        id: 3,
        label: "bookmark",
        icon: "BookmarkPlus",
        active: false,
        fn: handleClickSupport,
      },
      {
        id: 4,
        label: "like",
        icon: "Heart",
        active: false,
        fn: handleClickSupport,
      },
      {
        id: 5,
        label: "share",
        icon: "Share",
        active: false,
        fn: handleClickSupport,
      },
    ],
    [handleClickSupport],
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
