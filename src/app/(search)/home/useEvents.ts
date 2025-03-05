import { useConvexCtx } from "@/app/ctx/convex";
import { type XEvent } from "@/app/types";
import { Err } from "@/utils/helpers";
import { type SelectEvent } from "convex/events/d";
import { useCallback, useEffect, useState } from "react";
import { useLocal, type StorageItem } from "@/hooks/useLocal";

interface CoverCache {
  cover_src: string;
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export const useEvents = (events: SelectEvent[]) => {
  const [xEvents, setXEvents] = useState<XEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { vxFiles } = useConvexCtx();

  // Initialize localStorage items
  const initialItems: StorageItem<CoverCache>[] = events.map((event) => ({
    key: `cover_${event.event_id}`,
    data: { cover_src: "", timestamp: Date.now() },
  }));

  const { storage, setItem } = useLocal<CoverCache>(initialItems);

  const collectEvent = useCallback(
    async (event: SelectEvent) => {
      const cacheKey = `cover_${event.event_id}`;

      // Try to get from storage state first
      const cached = storage[cacheKey];
      if (cached?.cover_src && isCacheValid(cached.timestamp)) {
        return {
          ...event,
          cover_src: cached.cover_src,
        };
      }

      // If not in storage state, fetch and store
      const cover_src = await vxFiles.getUrl(event.cover_url);
      if (cover_src) {
        setItem(cacheKey, {
          cover_src,
          timestamp: Date.now(),
        });
      }

      return {
        ...event,
        cover_src,
      };
    },
    [vxFiles, storage, setItem],
  );

  const createSignedEvents = useCallback(async () => {
    setLoading(true);
    if (!events) return [];

    const promises = events.map(collectEvent);
    const resolve = await Promise.all(promises);
    setXEvents(resolve);
    setLoading(false);
  }, [events, collectEvent]);

  useEffect(() => {
    createSignedEvents().catch(Err(setLoading, "createSignedEvents"));
  }, [createSignedEvents]);

  return { xEvents, loading };
};
