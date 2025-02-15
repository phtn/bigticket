import moment from "moment";
import { useCallback, useMemo } from "react";

interface UseMoment {
  date?: number | undefined;
  start?: number | undefined;
  end?: number | undefined;
}
export const useMoment = ({ date, start, end }: UseMoment) => {
  const compact = useMemo(() => moment(date).format("ll"), [date]);
  const narrow = useMemo(() => {
    const d = moment(date).format("dddl");
    return { day: d.substring(0, 4), date: d.substring(3, 7) };
  }, [date]);

  const event_date = useMemo(() => moment(date).format("lll"), [date]);
  const event_day = useMemo(() => moment(date).format("dddd"), [date]);

  const atMinutes = useCallback((time: string) => {
    return time.indexOf(":");
  }, []);
  const minutes = useCallback(
    (time: string) => {
      return time.substring(atMinutes(time) + 1, atMinutes(time) + 3);
    },
    [atMinutes],
  );

  const startTime = moment(start).format("LT").replaceAll(" ", "");
  const startWithDate = moment(start).format("ll").split(",")[0];
  const start_compact =
    startTime.substring(0, atMinutes(startTime)) +
    startTime.substring(atMinutes(startTime) + 3);
  const start_time = useMemo(() => {
    return { full: startTime, compact: start_compact, date: startWithDate };
  }, [startTime, start_compact, startWithDate]);

  const endTime = moment(end).format("LT").replaceAll(" ", "");
  const endWithDate = moment(end).format("ll").split(",")[0];
  const end_compact =
    endTime.substring(0, atMinutes(endTime)) +
    endTime.substring(atMinutes(endTime) + 3);
  const end_time = useMemo(() => {
    return { full: endTime, compact: end_compact, date: endWithDate };
  }, [endTime, end_compact, endWithDate]);

  const event_time = useMemo(() => {
    return {
      full: `${startTime}-${endTime}`,
      compact: `${
        minutes(startTime) !== "00" ? startTime : start_compact
      }-${minutes(endTime) !== "00" ? endTime : end_compact}`,
    };
  }, [endTime, end_compact, startTime, start_compact, minutes]);

  const duration = useMemo(() => {
    if (!end || !start) return;
    return end - start;
  }, [end, start]);
  const durationDays = useMemo(() => {
    if (!end || !start) return;
    return (end - start) / 150000;
  }, [end, start]);
  const durationHrs = useMemo(() => {
    if (!end || !start) return;
    return (end - start) / 3600000;
  }, [end, start]);

  return {
    compact,
    event_day,
    event_date,
    event_time,
    start_time,
    end_time,
    duration,
    durationDays,
    durationHrs,
    minutes,
    narrow,
  };
};
