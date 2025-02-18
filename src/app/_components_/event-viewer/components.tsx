import { EventViewerCtx } from "@/app/ctx/event";
import { type ActionItem } from "@/app/ctx/event/viewer";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Shimmer } from "@/ui/text/sparkles";
import { opts } from "@/utils/helpers";
import { Button, Card, Spinner } from "@nextui-org/react";
import NumberFlow from "@number-flow/react";
import { use, useCallback, useEffect, useState } from "react";

interface GetTicketButtonProps {
  ticket_value?: number;
  is_private?: boolean;
  h: string;
  fn: VoidFunction;
}
export const GetTicketButton = ({
  ticket_value,
  is_private = false,
  h,
  fn,
}: GetTicketButtonProps) => {
  const [debounced, setDebounced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!debounced) {
        setDebounced(true);
      }
    }, 750);
    return () => clearTimeout(timer);
  }, [debounced]);

  const TicketLabel = useCallback(() => {
    const options = opts(
      <h2 className="text-xl font-black">
        <span className="font-bold italic tracking-tighter text-teal-400">
          Claim
        </span>
        Ticket
      </h2>,
      <h2 className="text-xl font-black">
        <span className="font-bold italic tracking-tighter text-slate-400">
          Buy
        </span>
        Tickets
      </h2>,
    );
    return <>{options.get(is_private)}</>;
  }, [is_private]);
  const TicketValue = useCallback(() => {
    const options = opts(
      <h3 className="flex items-center justify-center gap-1 text-orange-100">
        <Icon name="Lock" className="size-3.5" />
        <Shimmer
          sparklesCount={6}
          className="font-inter text-[16px]"
          text="Private Event"
        />
      </h3>,
      <NumberFlow
        value={ticket_value ?? 0}
        format={{
          notation: "standard",
          currency: "PHP",
          currencyDisplay: "narrowSymbol",
          style: "currency",
        }}
      />,
    );
    return <>{options.get(is_private)}</>;
  }, [ticket_value, is_private]);
  return (
    <div className={cn("z-1 relative bg-primary")} style={{ height: h }}>
      <Button
        onPress={fn}
        size="lg"
        disableRipple
        color="primary"
        className="h-full"
        radius="none"
        fullWidth
      >
        {debounced ? (
          <div
            className={cn("flex items-center gap-6", { "gap-14": is_private })}
          >
            <TicketLabel />
            <TicketValue />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Spinner size="md" color="secondary" />
          </div>
        )}
      </Button>
    </div>
  );
};

export const ClaimedTicketButton = ({
  is_private,
  h,
  fn,
}: GetTicketButtonProps) => {
  return (
    <div className="z-1 relative bg-primary" style={{ height: h }}>
      <Button
        onPress={fn}
        size="lg"
        disableRipple
        color="primary"
        className="h-full"
        radius="none"
        fullWidth
      >
        <div
          className={cn("flex w-full items-center justify-evenly", {
            "gap-12": is_private,
          })}
        >
          <h2 className="flex items-center gap-0.5 text-xl font-black">
            <span className="font-bold italic tracking-tighter text-teal-400">
              Ticket
            </span>
            Claimed
            <Icon name="Check" className="text-teal-400" />
          </h2>
          <div className="flex items-center gap-2">
            <p className="font-inter text-sm font-semibold capitalize">
              view my ticket
            </p>
            <Icon name="QrCode" className="opacity-80" />
          </div>
        </div>
      </Button>
    </div>
  );
};

export const ActionPanel = ({ h }: { h: string }) => {
  const { actions } = use(EventViewerCtx)!;

  const ActionButton = useCallback(
    (action: ActionItem) => {
      return (
        <button
          id={action.label}
          name={action.label}
          onClick={action.fn}
          className={cn(
            "flex h-full w-full items-center justify-center bg-white",
            "hover:bg-gray-200",
          )}
          style={{ height: h }}
        >
          <Icon name={action.icon} className="size-5" />
        </button>
      );
    },
    [h],
  );

  return (
    <HyperList
      data={actions}
      component={ActionButton}
      container="grid grid-cols-6 w-full border-b-[0.33px] border-zinc-400 bg-white font-medium"
      itemStyle="bg-gray-100"
      delay={0.3}
      direction="up"
    />
  );
};

interface EventGroupDetailProps {
  host_id: string | undefined;
  host_name: string | undefined;
  event_url: string | undefined;
  event_venue: string | undefined;
  h: string;
  is_online?: boolean
}
export const EventGroupDetail = ({
  host_name,
  event_venue,
  event_url,
  is_online,
  h,
}: EventGroupDetailProps) => {
  const [venue_name, venue_address] = event_venue?.split("---") ?? ["", ""];
  return (
    <div className="row-span-2 h-full">
      <div
        className="flex h-1/2 items-center justify-between border-b-[0.33px] border-zinc-400 bg-white px-4 font-semibold"
        style={{ height: h }}
      >
        <span>Organizers</span>
        <span>{host_name}</span>
      </div>
      <div
        className="flex h-1/2 items-center justify-between border-b-[0.33px] border-zinc-400 bg-white px-4 font-semibold"
        style={{ height: h }}
      >
        <span>{is_online ? "Website" : "Venue"}</span>
        <div className="text-right overflow-x-scroll">
          {is_online ? <div>{event_url}</div> :
            <>
              <p className="max-w-[30ch]">{venue_name}</p>
              <p className="text-tiny font-normal whitespace-nowrap max-w-[50ch] text-ellipsis opacity-80">{venue_address}</p>
            </>
          }
        </div>
      </div>
    </div >
  );
};

interface InfoGridProps {
  data: InfoItem[];
  h: string;
}
export const InfoGrid = ({ data, h }: InfoGridProps) => {
  const InfoGridItem = useCallback(
    (info: InfoItem) => (
      <Card
        radius="none"
        className="h-full space-y-0.5 border-b-[0.33px] border-r-[0.33px] border-zinc-400 bg-white px-2 py-2 shadow-none group-hover/list:bg-gray-200 md:px-3"
        style={{ height: h }}
      >
        <div className="text-xs tracking-tight">{info.label}</div>
        <div className="text-sm font-semibold tracking-tighter md:text-[16px]">
          {info.label === "likes" ? (
            <NumberFlow value={info.value as number} />
          ) : (
            <span>{info.value}</span>
          )}
        </div>
      </Card>
    ),
    [h],
  );
  return (
    <HyperList
      delay={0.7}
      data={data}
      component={InfoGridItem}
      container="grid row-span-3 w-full grid-cols-3"
      keyId={"label"}
    />
  );
};

export interface InfoItem {
  label: string;
  value?: string | number;
}

export const EventViewerFooter = ({ h }: { h: string }) => (
  <div
    className="flex h-[36px] w-full items-center justify-end bg-peach px-2 text-xs font-light md:h-[36px]"
    style={{ height: h }}
  >
    Big Ticket &copy;{new Date().getFullYear()}
  </div>
);
