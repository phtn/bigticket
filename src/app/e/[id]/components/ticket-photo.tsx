import { useMoment } from "@/hooks/useMoment";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { TicketStack } from "@/ui/card/ticket";
import type { SelectEvent } from "convex/events/d";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";

interface TicketPhotoProps {
  event: SelectEvent | undefined;
}
export const TicketPhoto = ({ event }: TicketPhotoProps) => {
  const [ticket_color, setTicketColor] = useState("bg-macl-mint");
  const { event_time } = useMoment({
    start: event?.start_date,
    end: event?.end_date,
  });
  const date = useMemo(
    () => moment(event?.event_date).format("LT"),
    [event?.event_date],
  );
  const day = useMemo(
    () => moment(event?.event_date).format("dddd"),
    [event?.event_date],
  );

  const handleColorSelect = useCallback(
    (color: string) => () => {
      setTicketColor(color);
    },
    [],
  );
  return (
    <div className="relative flex h-full justify-center border-primary/40 md:border-r xl:border-r-0">
      <div className="absolute top-0 z-10 flex h-10 w-full items-center text-xs md:justify-end">
        <div className="flex h-7 items-center gap-2 rounded-e-full bg-void/10 pe-1 ps-2.5 font-semibold text-primary backdrop-blur-md md:rounded-e-none md:rounded-s-full">
          Event Ticket
        </div>
      </div>
      <div className="dbg-tan/20 flex h-[360px] items-center justify-center">
        <TicketStack
          title={event?.event_name}
          date={date}
          time={event_time.compact}
          site={event?.event_geo ?? event?.event_url}
          day={day}
          tickets={event?.ticket_count}
          color={ticket_color}
        />
      </div>
      <div className="absolute bottom-0 flex h-20 w-full items-center justify-start overflow-x-scroll border-t border-primary/40 bg-peach/5 px-4 md:space-x-1.5 lg:justify-center lg:space-x-2 lg:px-2">
        {palette_one.map((item) => (
          <button
            onClick={handleColorSelect(item.label)}
            key={item.label + item.id}
            className="relative flex items-center justify-center transition-all duration-300 active:scale-90 active:opacity-80"
          >
            <Icon name="Squircle" className={`size-8 ${item.color}`} />
            <Icon
              name="Check"
              className={cn("absolute hidden size-3 animate-enter text-white", {
                flex: ticket_color === item.label,
              })}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

interface Palette {
  id: number;
  color: string;
  label: string;
}
const palette_one: Palette[] = [
  {
    id: 0,
    color: "text-macl-red",
    label: "bg-macl-red",
  },
  {
    id: 1,
    color: "text-macl-orange",
    label: "bg-macl-orange",
  },
  {
    id: 2,
    color: "text-macl-yellow",
    label: "bg-macl-yellow",
  },
  {
    id: 3,
    color: "text-macl-green",
    label: "bg-macl-green",
  },
  {
    id: 4,
    color: "text-macl-mint",
    label: "bg-macl-mint",
  },
  {
    id: 5,
    color: "text-macl-teal",
    label: "bg-macl-teal",
  },
  {
    id: 6,
    color: "text-macl-cyan",
    label: "bg-macl-cyan",
  },
  {
    id: 7,
    color: "text-macl-blue",
    label: "bg-macl-blue",
  },
  {
    id: 8,
    color: "text-macl-indigo",
    label: "bg-macl-indigo",
  },
  {
    id: 9,
    color: "text-macl-purple",
    label: "bg-macl-purple",
  },
  {
    id: 10,
    color: "text-macl-pink",
    label: "bg-macl-pink",
  },
  {
    id: 11,
    color: "text-macl-brown",
    label: "bg-macl-brown",
  },
  {
    id: 12,
    color: "text-macl-gray",
    label: "bg-macl-gray",
  },
  {
    id: 13,
    color: "text-void",
    label: "bg-void",
  },
];
