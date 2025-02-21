"use client";

import { ConvexCtx } from "@/app/ctx/convex";
import { type SignedEvent } from "@/app/ctx/event/all";
import { PreloadedUserEventsCtx } from "@/app/ctx/event/user";
import { useImage } from "@/hooks/useImage";
import { Err, Ok } from "@/utils/helpers";
import { log } from "@/utils/logger";
import {
  type ChangeEvent,
  createContext,
  type RefObject,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface EventEditorCtxValues {
  uploadFromSource: (
    src: string | undefined,
    event_id: string | undefined,
    field: "cover_url" | "photo_url",
  ) => Promise<string | null>;
  uploadFromFile: (
    file: File | undefined,
    event_id: string | undefined,
    field: "cover_url" | "photo_url",
  ) => Promise<string | null>;
  getCoverPhoto: (cover_url: string | undefined) => Promise<void>;
  cover_src: string | null;
  uploading: boolean;
  query: string | undefined;
  locale: string | undefined;
  getRefs: (props: ImageRefs) => void;
  browseFile: VoidFunction;
  onInputFileChange: (e: ChangeEvent<HTMLInputElement>) => File | undefined;
  updateTextColor: (id: string | undefined, light: boolean) => Promise<void>;
  updateQueryParams: (
    query: string | undefined,
    locale: string | undefined,
  ) => void;
  getSignedEvent: (event_id: string | undefined) => void;
  signedEvent: SignedEvent | null;
  pending: boolean;
}
interface ImageRefs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  inputFileRef: RefObject<HTMLInputElement | null>;
}

export const EventEditorCtx = createContext<EventEditorCtxValues | null>(null);

export const EventEditorCtxProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [uploading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState<string | undefined>("cityscapes");
  const [locale, setLocale] = useState<string | undefined>("en-US");
  const [cover_src, setCoverSrc] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [inputFile, setInputFile] = useState<HTMLInputElement | null>(null);
  const [signedEvent, setSignedEvent] = useState<SignedEvent | null>(null);

  const { signedEvents } = use(PreloadedUserEventsCtx)!;

  const getSignedEvent = useCallback(
    (event_id: string | undefined) => {
      setPending(true);
      if (!event_id) return;
      const event = signedEvents?.find((e) => e.event_id === event_id) ?? null;
      setSignedEvent(event);
      setPending(false);
    },
    [signedEvents],
  );

  const getRefs = useCallback(({ canvasRef, inputFileRef }: ImageRefs) => {
    setCanvas(canvasRef.current);
    setInputFile(inputFileRef.current);
  }, []);

  const { fromSource, fromFile, browseFile, onInputFileChange } = useImage(
    canvas,
    inputFile,
  );

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
      if (!cover_url) return;
      setCoverSrc(await files.get(cover_url));
    },
    [files],
  );

  const updateTextColor = useCallback(
    async (id: string | undefined, light: boolean) => {
      if (!id) return;
      await events.update.isCoverLight(id, light);
    },
    [events.update],
  );

  const saveFn = useCallback(
    async (
      url: string | null,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      if (!url || !event_id) return null;

      const updateField = async (
        updateFn: (id: string, url: string) => Promise<string | null>,
        successMessage: string,
      ) => {
        try {
          await updateFn(event_id, url);
          Ok(setLoading, successMessage)();
          return "success";
        } catch (e) {
          Err(setLoading, "Failed to update photo.")(e as Error);
          return null;
        }
      };

      switch (field) {
        case "cover_url":
          return await updateField(
            events.update.cover_url,
            "Cover photo updated!",
          );
        case "photo_url":
          return await updateField(
            events.update.photo_url,
            "Event photo updated!",
          );
        default:
          return null;
      }
    },
    [events.update, setLoading],
  );

  const uploadFromFile = useCallback(
    async (
      file: File | undefined,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      setLoading(true);
      const webp = await fromFile(file);
      const url = await files.create(webp as File);
      return await saveFn(url, event_id, field);
    },
    [files, saveFn, fromFile],
  );

  const uploadFromSource = useCallback(
    async (
      src: string | undefined,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      setLoading(true);
      if (!src) return null;
      const webp = await fromSource(src);
      const url = await files.create(webp as File);
      return await saveFn(url, event_id, field);
    },
    [files, saveFn, fromSource],
  );

  const value = useMemo(
    () => ({
      uploadFromSource,
      uploadFromFile,
      updateTextColor,
      uploading,
      query,
      locale,
      updateQueryParams,
      getCoverPhoto,
      cover_src,
      getRefs,
      browseFile,
      onInputFileChange,
      getSignedEvent,
      signedEvent,
      pending,
    }),
    [
      uploadFromSource,
      uploadFromFile,
      updateTextColor,
      uploading,
      query,
      locale,
      updateQueryParams,
      getCoverPhoto,
      cover_src,
      getRefs,
      browseFile,
      onInputFileChange,
      getSignedEvent,
      signedEvent,
      pending,
    ],
  );
  return <EventEditorCtx value={value}>{children}</EventEditorCtx>;
};
