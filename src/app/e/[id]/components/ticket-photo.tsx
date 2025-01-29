import { TicketStack } from "@/ui/card/ticket";
import type { SelectEvent } from "convex/events/d";
import moment from "moment";
import { useMemo } from "react";

interface TicketPhotoProps {
  event: SelectEvent | undefined;
}
export const TicketPhoto = ({ event }: TicketPhotoProps) => {
  const date = useMemo(
    () => moment(event?.event_date).format("LT"),
    [event?.event_date],
  );
  const day = useMemo(
    () => moment(event?.event_date).format("dddd"),
    [event?.event_date],
  );
  return (
    <div className="relative flex h-full min-h-80 items-center justify-center border-primary/40 md:border-r xl:border-r-0">
      <div className="absolute top-0 flex h-10 w-full items-center justify-between px-4 text-xs">
        <p>Event Ticket</p>
      </div>
      <TicketStack
        title={event?.event_name}
        date={date}
        time={""}
        site={event?.event_geo ?? event?.event_url}
        day={day}
        tickets={String(event?.ticket_count)}
      />
    </div>
  );
};
