import { Icon } from "@/icons";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { Card } from "@nextui-org/react";
import NumberFlow from "@number-flow/react";
import { useCallback, useMemo } from "react";
import { type InfoItem, type PanelItem } from "../useEventInfo";

interface ActionPanelProps {
  h: string;
  data: PanelItem[] | undefined;
}

export const ActionPanel = ({ h, data }: ActionPanelProps) => {
  const PanelButton = useCallback(
    (action: PanelItem) => {
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
      data={data}
      component={PanelButton}
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
  is_online?: boolean;
  debounced: boolean;
}
export const EventGroupDetail = ({
  host_name,
  event_venue,
  event_url,
  is_online,
  h,
  debounced,
}: EventGroupDetailProps) => {
  const [venue_name, venue_address] = useMemo(
    () => event_venue?.split("---") ?? ["", ""],
    [event_venue],
  );

  return (
    <div className="row-span-2 h-full">
      <div
        className="flex h-1/2 items-center justify-between border-b-[0.33px] border-zinc-400 bg-white px-4 font-semibold"
        style={{ height: h }}
      >
        <span>Organizers</span>
        {!debounced ? (
          <Icon name="SpinnerDotScale" />
        ) : (
          <span className="animate-enter">{host_name}</span>
        )}
      </div>
      <div
        className="flex h-1/2 items-center justify-between border-b-[0.33px] border-zinc-400 bg-white px-4 font-semibold"
        style={{ height: h }}
      >
        <span>{is_online ? "Website" : "Venue"}</span>
        {!debounced ? (
          <Icon name="SpinnerDotScale" />
        ) : (
          <div className="overflow-x-scroll text-right">
            {is_online ? (
              <div>{event_url}</div>
            ) : (
              <>
                <p className="max-w-[30ch] animate-enter">{venue_name}</p>
                <p className="max-w-[50ch] animate-enter text-ellipsis whitespace-nowrap text-tiny font-normal opacity-80 delay-200">
                  {venue_address}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface InfoGridProps {
  data: InfoItem[] | undefined;
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

export const EventViewerFooter = ({ h }: { h: string }) => (
  <div
    className="flex h-[36px] w-full items-center justify-end bg-peach px-2 text-xs font-light md:h-[36px]"
    style={{ height: h }}
  >
    Big Ticket &copy;{new Date().getFullYear()}
  </div>
);
