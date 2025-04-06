import { useCallback, useMemo } from "react";
import {
  format,
  differenceInMilliseconds,
  differenceInDays,
  differenceInHours,
} from "date-fns";

interface UseMoment {
  date?: number | undefined;
  start?: number | undefined;
  end?: number | undefined;
}

const DATE_FORMATS = {
  COMPACT: "MMM d, yyyy",
  FULLDATE: "MMMM d, yyyy",
  TIME: "h:mma",
  TIME_SHORT: "ha",
  FULL_DATE_TIME: "MMM d, yyyy h:mm a",
  SHORT_DAY: "EEE",
  FULL_DAY: "EEEE",
  MONTH_DAY: "MMM d",
  MINUTES: "mm",
} as const;

export const useMoment = ({ start, end }: UseMoment) => {
  const compact = useMemo(
    () => (start ? format(start, DATE_FORMATS.COMPACT) : ""),
    [start],
  );

  const full_date = useMemo(
    () => (start ? format(start, DATE_FORMATS.FULLDATE) : ""),
    [start],
  );

  const narrow = useMemo(() => {
    if (!start) return { day: "", date: "" };
    const day = format(start, DATE_FORMATS.SHORT_DAY);
    const date = format(start, DATE_FORMATS.MONTH_DAY);
    return { day, date };
  }, [start]);

  const event_date = useMemo(
    () => (start ? format(start, DATE_FORMATS.FULL_DATE_TIME) : ""),
    [start],
  );

  const event_day = useMemo(
    () => (start ? format(start, DATE_FORMATS.FULL_DAY) : ""),
    [start],
  );

  const formatTimeCompact = useCallback((date: number) => {
    const timeStr = format(date, DATE_FORMATS.TIME);
    const hasMinutes = format(date, DATE_FORMATS.MINUTES) !== "00";
    return hasMinutes ? timeStr : format(date, DATE_FORMATS.TIME_SHORT);
  }, []);

  const start_time = useMemo(() => {
    if (!start) return { full: "", compact: "", date: "" };
    return {
      full: format(start, DATE_FORMATS.TIME),
      compact: formatTimeCompact(start),
      date: format(start, DATE_FORMATS.MONTH_DAY),
    };
  }, [start, formatTimeCompact]);

  const end_time = useMemo(() => {
    if (!end) return { full: "", compact: "", date: "" };
    return {
      full: format(end, DATE_FORMATS.TIME),
      compact: formatTimeCompact(end),
      date: format(end, DATE_FORMATS.MONTH_DAY),
    };
  }, [end, formatTimeCompact]);

  const event_time = useMemo(() => {
    if (!start || !end) return { full: "", compact: "" };
    return {
      full: `${format(start, DATE_FORMATS.TIME)}-${format(end, DATE_FORMATS.TIME)}`,
      compact: `${formatTimeCompact(start)}-${formatTimeCompact(end)}`,
    };
  }, [end, start, formatTimeCompact]);

  const duration = useMemo(() => {
    if (!end || !start) return;
    return differenceInMilliseconds(end, start);
  }, [end, start]);

  const durationDays = useMemo(() => {
    if (!end || !start) return;
    return differenceInDays(end, start);
  }, [end, start]);

  const durationHrs = useMemo(() => {
    if (!end || !start) return;
    return differenceInHours(end, start);
  }, [end, start]);

  return {
    compact,
    full_date,
    event_day,
    event_date,
    event_time,
    start_time,
    end_time,
    duration,
    durationDays,
    durationHrs,
    narrow,
  };
};
