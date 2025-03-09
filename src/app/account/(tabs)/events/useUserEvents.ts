import { useEvents } from "@/app/(search)/home/useEvents";
import { preloadEventsByCohostEmail } from "@/app/actions";
import { type XEvent } from "@/app/types";
import { Err } from "@/utils/helpers";
import { type SelectEvent } from "convex/events/d";
import { useCallback, useEffect, useState } from "react";

export const useUserEvents = (email: string | undefined) => {
  const [cohostedEvents, setCohostedEvents] = useState<SelectEvent[]>();
  const [loading, setLoading] = useState(false);
  const preloadCohostedEvents = useCallback(async () => {
    if (email) {
      return await preloadEventsByCohostEmail([email]);
    }
  }, [email]);

  const [cohostedXEvents, setCohostedXEvents] = useState<XEvent[]>();

  const { xEvents: cohostedXE } = useEvents(cohostedEvents ?? []);

  useEffect(() => {
    setLoading(true);
    preloadCohostedEvents().then(setCohostedEvents).catch(Err(setLoading));
  }, [preloadCohostedEvents]);

  useEffect(() => {
    if (cohostedXE) {
      setCohostedXEvents(cohostedXE);
      setLoading(false);
    }
  }, [cohostedXE]);

  return {
    cohostedXEvents,
    loading,
  };
};
