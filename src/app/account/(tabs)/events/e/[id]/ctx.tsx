"use client";

import { useConvexCtx } from "@/app/ctx/convex";
import { usePreloadedUserEvents } from "@/app/ctx/event/user";
import { type XEvent } from "@/app/types";
import { useImage } from "@/hooks/useImage";
import { log } from "@/utils/logger";
import { usePathname } from "next/navigation";
import {
  type ChangeEvent,
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
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
  xEvent: XEvent | null;
  pending: boolean;
  event_id: string | undefined;
  user_id: string | undefined;
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
  const [isPending, startTransition] = useTransition();
  const [uploading, setLoading] = useState(false);
  const [query, setQuery] = useState<string | undefined>("cityscapes");
  const [locale, setLocale] = useState<string | undefined>("en-US");
  const [cover_src, setCoverSrc] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [inputFile, setInputFile] = useState<HTMLInputElement | null>(null);
  const [xEvent, setXEvent] = useState<XEvent | null>(null);

  const { x } = usePreloadedUserEvents();
  const { vxFiles, vxEvents } = useConvexCtx();

  const pathname = usePathname();
  const ids = useMemo(() => pathname.split("/").pop(), [pathname]);
  const [event_id, user_id] = useMemo(
    () => (ids ? ids.split("---") : [undefined, undefined]),
    [ids],
  );

  useEffect(() => {
    if (event_id) {
      startTransition(() => {
        const event = x?.find((e) => e.event_id === event_id);
        setXEvent(event ?? null);
      });
    }
  }, [x, event_id, startTransition]);

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
      startTransition(() => {
        setQuery(q);
        setLocale(l);
        log("query-data", [q, l]);
      });
    },
    [startTransition],
  );

  const getCoverPhoto = useCallback(
    async (cover_url: string | undefined) => {
      if (!cover_url) return;
      // Use startTransition to update reactively.
      startTransition(async () => {
        const url = await vxFiles.getUrl(cover_url);
        setCoverSrc(url);
      });
    },
    [vxFiles, startTransition],
  );

  const updateTextColor = useCallback(
    async (id: string | undefined, light: boolean) => {
      if (!id) return;
      startTransition(async () => {
        await vxEvents.mut.updateEventIsCoverLight({
          id,
          is_cover_light: light,
        });
      });
    },
    [vxEvents.mut, startTransition],
  );

  const updateCoverUrl = useCallback(
    async (id: string, cover_url: string) => {
      return await vxEvents.mut.updateCoverUrl({ id, cover_url });
    },
    [vxEvents.mut],
  );

  const saveFn = useCallback(
    async (
      url: string | null,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      if (!url || !event_id) return null;
      // Update the cover URL in the backend
      const updated = await updateCoverUrl(event_id, url);
      // Refresh the reactive cover state if it's a cover update
      if (field === "cover_url") {
        await getCoverPhoto(url);
      }
      return updated;
    },
    [getCoverPhoto, updateCoverUrl],
  );

  const createUrl = useCallback(
    async (file: File | undefined) => await vxFiles.create(file),
    [vxFiles],
  );

  const uploadFromFile = useCallback(
    async (
      file: File | undefined,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      setLoading(true);
      try {
        const webp = await fromFile(file);
        const url = await createUrl(webp);
        return await saveFn(url, event_id, field);
      } finally {
        setLoading(false);
      }
    },
    [createUrl, fromFile, saveFn],
  );

  const uploadFromSource = useCallback(
    async (
      src: string | undefined,
      event_id: string | undefined,
      field: "cover_url" | "photo_url",
    ) => {
      if (!src) return null;
      setLoading(true);
      try {
        const webp = await fromSource(src);
        const url = await createUrl(webp);
        return await saveFn(url, event_id, field);
      } finally {
        setLoading(false);
      }
    },
    [createUrl, fromSource, saveFn],
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
      xEvent,
      pending: isPending,
      event_id,
      user_id,
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
      xEvent,
      isPending,
      event_id,
      user_id,
    ],
  );

  return (
    <EventEditorCtx.Provider value={value}>{children}</EventEditorCtx.Provider>
  );
};

export const useEventEditor = () => {
  const ctx = useContext(EventEditorCtx);
  if (!ctx) {
    throw new Error("useEventEditor must be used within an EventEditorCtx");
  }
  return ctx;
};
