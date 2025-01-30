import moment from "moment";
import { useMemo } from "react";

interface UseDate {
  date: number | undefined;
}
export const useMoment = ({ date }: UseDate) => {
  const event_date = useMemo(() => moment(date).format("lll"), [date]);
  const event_day = useMemo(() => moment(date).format("dddd"), [date]);
  return { event_day, event_date };
};
