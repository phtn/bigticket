import { EventViewerCtx, PreloadedEventsCtx } from "@/app/ctx/event";
import { type ActionItem } from "@/app/ctx/event/viewer";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Button, Card } from "@nextui-org/react";
import NumberFlow from "@number-flow/react";
import { use } from "react";

export const BuyTicketButton = ({
  ticket_value,
}: {
  ticket_value: number | undefined;
}) => (
  <div className="z-1 relative bg-primary">
    <Button
      size="lg"
      disableRipple
      color="primary"
      className="h-16"
      radius="none"
      fullWidth
    >
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold">
          <span className="font-semibold italic text-slate-300">Buy</span>{" "}
          Tickets
        </span>
        <span className="text-xl font-extrabold"></span>
        <div className="rounded-sm px-4 py-1 text-2xl">
          <NumberFlow
            value={ticket_value ?? 0}
            format={{
              notation: "standard",
              currency: "PHP",
              currencyDisplay: "narrowSymbol",
              style: "currency",
            }}
          />
        </div>
      </div>
    </Button>
  </div>
);

export const ActionPanel = () => {
  const { actions } = use(EventViewerCtx)!;

  return (
    <HyperList
      data={actions}
      component={ActionButton}
      container="grid h-16 grid-cols-6 w-full border-b-[0.33px] border-zinc-400 bg-white font-medium"
      itemStyle="h-16 bg-gray-100"
      delay={0.3}
      direction="up"
    />
  );
};

const ActionButton = (action: ActionItem) => {
  const { selectedEvent } = use(PreloadedEventsCtx)!;

  return (
    <button
      id={action.label}
      name={action.label}
      onClick={action.fn({
        title: selectedEvent?.event_name,
        text: selectedEvent?.event_id,
        url: "https://bigticket-pro.vercel.app",
      })}
      className={cn(
        "flex h-full w-full items-center justify-center bg-white",
        "hover:bg-gray-200",
      )}
    >
      <Icon name={action.icon} className="size-5" />
    </button>
  );
};

interface EventGroupDetailProps {
  host_id: string | undefined;
  host_name: string | undefined;
  event_geo: string | undefined;
  event_url: string | undefined;
}
export const EventGroupDetail = ({
  host_name,
  event_geo,
  event_url,
}: EventGroupDetailProps) => {
  return (
    <div className="h-32 md:h-28">
      <div className="flex h-16 items-center justify-between border-b-[0.33px] border-zinc-400 bg-white p-4 font-semibold md:h-14">
        <span>Organizers</span>
        <span>{host_name}</span>
      </div>
      <div className="flex h-16 items-center justify-between border-b-[0.33px] border-zinc-400 bg-white p-4 font-medium md:h-14">
        <span>Location</span>
        <span>{event_geo ?? event_url}</span>
      </div>
    </div>
  );
};

export const InfoGrid = ({ data }: { data: InfoItem[] }) => (
  <HyperList
    delay={0.7}
    data={data}
    component={InfoGridItem}
    container="grid h-48 w-full grid-cols-3"
    keyId={"label"}
  />
);

export interface InfoItem {
  label: string;
  value: string | number | undefined;
}

const InfoGridItem = (info: InfoItem) => (
  <Card
    radius="none"
    className="h-full space-y-0.5 border-b-[0.33px] border-r-[0.33px] border-zinc-400 bg-white px-2 py-2 shadow-none group-hover/list:bg-gray-200 md:px-3"
  >
    <div className="text-xs tracking-tight">{info.label}</div>
    <div className="text-sm font-semibold tracking-tighter md:text-[16px]">
      {info.value}
    </div>
  </Card>
);

export const EventViewerFooter = () => (
  <div className="flex h-32 w-full items-center justify-end bg-peach px-2 text-xs font-light md:h-[30px]">
    Big Ticket &copy;{new Date().getFullYear()}
  </div>
);
