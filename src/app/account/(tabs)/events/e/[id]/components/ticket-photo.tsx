import { useMoment } from "@/hooks/useMoment";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { TicketStack } from "@/ui/card/ticket";
import type { SelectEvent } from "convex/events/d";
import { useCallback, useState } from "react";

interface TicketPhotoProps {
  event: SelectEvent | null;
}
export const TicketPhoto = ({ event }: TicketPhotoProps) => {
  const [ticket_color, setTicketColor] = useState("bg-macl-mint");
  const { event_time, compact, event_day } = useMoment({
    start: event?.start_date,
    end: event?.end_date,
  });

  const handleColorSelect = useCallback(
    (color: string) => () => {
      setTicketColor(color);
    },
    [],
  );
  return (
    <div className="relative flex h-full justify-center border-t-0 border-macl-gray bg-white sm:border-t md:rounded-md md:border">
      <div className="absolute top-0 z-10 flex h-10 w-full items-center text-xs md:justify-end">
        <div className="flex h-7 items-center gap-2 rounded-e-full bg-void/60 pe-2.5 ps-1.5 font-inter font-semibold tracking-tight text-primary md:rounded-e-none md:rounded-s-full">
          Event Ticket
        </div>
      </div>
      <div className="flex h-[360px] items-center justify-center bg-tan md:h-[400px]">
        <TicketStack
          title={event?.event_name}
          date={compact}
          time={event_time.compact}
          site={event?.event_geo ?? event?.event_url}
          day={event_day}
          tickets={event?.ticket_count}
          color={ticket_color}
        />
      </div>
      <div className="absolute bottom-0 flex h-20 w-full items-center justify-start overflow-x-scroll border-primary/40 px-4 md:space-x-1.5 md:border-t lg:justify-center lg:space-x-2 lg:px-2">
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
