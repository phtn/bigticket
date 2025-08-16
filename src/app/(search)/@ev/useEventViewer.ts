import { type XEvent } from "@/app/types";
import { useMoment } from "@/hooks/useMoment";
import { useMemo } from "react";

interface EventViewerHookProps {
  xEvents: XEvent[];
  eventId: string | null;
}

export interface Moments {
  start_time: {
    full: string;
    compact: string;
    date: string | undefined;
  };
  narrow: {
    day: string;
    date: string;
  };
}

export const useEventViewer = ({ xEvents, eventId }: EventViewerHookProps) => {
  const xEvent = useMemo(() => {
    return xEvents.find((x) => x.event_id === eventId);
  }, [eventId, xEvents]);

  const { start_time, narrow } = useMoment({
    start: xEvent?.start_date,
    end: xEvent?.end_date,
  });

  const moments = useMemo(() => ({ start_time, narrow }), [start_time, narrow]);

  return { xEvent, moments };
};
