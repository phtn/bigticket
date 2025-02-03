"use client";

import { ConvexCtx } from "@/app/ctx/convex";
import { Err, guid, Ok } from "@/utils/helpers";
import { type Id } from "@vx/dataModel";
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface EventEditorCtxValues {
  createUpload: (
    src: string | undefined,
    event_id: string | undefined,
    field: "cover_url" | "photo_url",
  ) => Promise<Id<"events"> | null>;
  uploading: boolean;
}
export const EventEditorCtx = createContext<EventEditorCtxValues | null>(null);

export const EventEditorCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [uploading, setLoading] = useState(false);
  const { files, events } = use(ConvexCtx)!;

  const createUpload = useCallback(
    async (
      src: string | undefined,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      setLoading(true);
      if (!src) return null;
      const promise = await urlsToFiles([src]);

      const file = promise[0]?.file;

      const url = await files.create(file);
      if (!url || !event_id) return null;
      switch (field) {
        case "cover_url":
          await events.update
            .cover_url(event_id, url)
            .then(Ok(setLoading, "Cover photo updated!"))
            .catch(Err(setLoading));
          return null;
        case "photo_url":
          await events.update
            .photo_url(event_id, url)
            .then(Ok(setLoading, "Event photo updated!"))
            .catch(Err(setLoading));
          return null;
        default:
          return null;
      }
    },
    [events.update, files],
  );

  const value = useMemo(
    () => ({
      createUpload,
      uploading,
    }),
    [createUpload, uploading],
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
