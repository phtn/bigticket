import { useConvexCtx } from "@/app/ctx/convex";
import { type XEvent } from "@/app/types";
import { type SelectEvent } from "convex/events/d";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useLocal, type StorageItem } from "@/hooks/useLocal";
import { Err } from "@/utils/helpers";

interface CoverCache {
  cover_src: string;
  timestamp: number;
}

const isCacheValid = (timestamp: number) => {
  const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours
  return Date.now() - timestamp < CACHE_DURATION;
};

export const useEvents = (events: SelectEvent[]) => {
  const [xEvents, setXEvents] = useState<XEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { vxFiles } = useConvexCtx();

  // Memoize initial storage items
  const initialItems: StorageItem<CoverCache>[] = useMemo(
    () =>
      events.map((event) => ({
        key: `cover_${event.event_id}`,
        data: { cover_src: "", timestamp: Date.now() },
      })),
    [events],
  );

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
    if (!events?.length) {
      setXEvents([]);
      setLoading(false);
      return;
    }

    try {
      const promises = events?.map(collectEvent);
      const resolve = await Promise.all(promises);
      setXEvents(resolve);
    } catch (error) {
      console.error("Error creating signed events:", error);
    } finally {
      setLoading(false);
    }
  }, [collectEvent, events]);

  useEffect(() => {
    createSignedEvents().catch(Err(setLoading));
  }, [createSignedEvents]);

  // Memoize the return value to maintain referential equality
  return useMemo(
    () => ({
      xEvents,
      loading,
    }),
    [xEvents, loading],
  );
};
