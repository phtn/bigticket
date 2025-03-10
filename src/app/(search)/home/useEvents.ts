import { useConvexCtx } from "@/app/ctx/convex";
import { type XEvent } from "@/app/types";
import { type SelectEvent } from "convex/events/d";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
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

  // Use ref to keep track of the latest events array without causing re-renders
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

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
    const currentEvents = eventsRef.current;
    if (!currentEvents?.length) {
      setXEvents([]);
      setLoading(false);
      return;
    }

    try {
      const promises = currentEvents.map(collectEvent);
      const resolve = await Promise.all(promises);
      setXEvents(resolve);
    } catch (error) {
      console.error("Error creating signed events:", error);
    } finally {
      setLoading(false);
    }
  }, [collectEvent]);

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
