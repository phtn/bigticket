import { ConvexCtx } from "@/app/ctx/convex";
import { type XEvent } from "@/app/types";
import { Err } from "@/utils/helpers";
import { type SelectEvent } from "convex/events/d";
import { use, useCallback, useEffect, useState } from "react";

export const useEvents = (events: SelectEvent[]) => {
  const [xEvents, setXEvents] = useState<XEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { files } = use(ConvexCtx)!;

  const collectEvent = useCallback(
    async (event: SelectEvent) => ({
      ...event,
      cover_src: await files.get(event.cover_url),
    }),
    [files],
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
    createSignedEvents().catch(Err(setLoading));
  }, [createSignedEvents]);

  return { xEvents, loading };
};
