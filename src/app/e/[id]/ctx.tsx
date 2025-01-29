"use client";

import { guid } from "@/utils/helpers";
import { createContext, useMemo, type ReactNode } from "react";

interface EventEditorCtxValues {
  on: boolean;
}
export const EventEditorCtx = createContext<EventEditorCtxValues | null>(null);

export const EventEditorCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const value = useMemo(
    () => ({
      on: false,
    }),
    [],
  );
  return <EventEditorCtx value={value}>{children}</EventEditorCtx>;
};

export async function urlsToFiles(urls: (string | null)[]) {
  const filePromises = urls?.map(async (url, i) => {
    if (!url) url = "_";
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = "BIG" + guid().split("-")[2];
    const file = new File([blob], filename, { type: blob.type });
    return { url, filename, file, id: i + 1 };
  });

  return Promise.all(filePromises);
}
