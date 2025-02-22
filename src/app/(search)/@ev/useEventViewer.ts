import { type XEvent } from "@/app/types";
import { useMoment } from "@/hooks/useMoment";
import { useEffect, useMemo, useState } from "react";

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
  const [xEvent, setXEvent] = useState<XEvent>();

  useEffect(() => {
    const x = xEvents.find((x) => x.event_id === eventId);
    setXEvent(x);
  }, [eventId, xEvents]);

  const { start_time, narrow } = useMoment({
    start: xEvent?.start_date,
    end: xEvent?.end_date,
  });

  const moments = useMemo(() => ({ start_time, narrow }), [start_time, narrow]);

  return { xEvent, moments };
};
