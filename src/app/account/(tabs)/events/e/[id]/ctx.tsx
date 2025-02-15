"use client";

import { ConvexCtx } from "@/app/ctx/convex";
import { Err, guid, Ok } from "@/utils/helpers";
import { log } from "@/utils/logger";
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
  createFileUpload: (
    file: File | undefined,
    event_id: string | undefined,
    field: "cover_url" | "photo_url",
  ) => Promise<Id<"events"> | null>;
  getCoverPhoto: (cover_url: string | undefined) => Promise<void>;
  cover_src: string | null;
  uploading: boolean;
  query: string | undefined;
  locale: string | undefined;
  updateQueryParams: (
    query: string | undefined,
    locale: string | undefined,
  ) => void;
}
export const EventEditorCtx = createContext<EventEditorCtxValues | null>(null);

export const EventEditorCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [uploading, setLoading] = useState(false);
  const [query, setQuery] = useState<string | undefined>("cityscapes");
  const [locale, setLocale] = useState<string | undefined>("en-US");
  const [cover_src, setCoverSrc] = useState<string | null>(null);

  const updateQueryParams = useCallback(
    (q: string | undefined, l: string | undefined) => {
      setQuery(q);
      setLocale(l);
      log("query-data", [q, l]);
    },
    [],
  );

  const { files, events } = use(ConvexCtx)!;

  const getCoverPhoto = useCallback(
    async (cover_url: string | undefined) => {
      console.log(cover_url);
      if (!cover_url) return;
      setCoverSrc(await files.get(cover_url));
    },
    [files],
  );

  const saveFn = useCallback(
    async (
      url: string | null,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
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
    [events.update],
  );

  const createFileUpload = useCallback(
    async (
      file: File | undefined,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      setLoading(true);
      const url = await files.create(file);
      return await saveFn(url, event_id, field);
    },
    [files, saveFn],
  );

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
      return await saveFn(url, event_id, field);
    },
    [files, saveFn],
  );

  const value = useMemo(
    () => ({
      createUpload,
      createFileUpload,
      uploading,
      query,
      locale,
      updateQueryParams,
      getCoverPhoto,
      cover_src,
    }),
    [
      createUpload,
      createFileUpload,
      uploading,
      query,
      locale,
      updateQueryParams,
      getCoverPhoto,
      cover_src,
    ],
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
