import { cn } from "@/lib/utils";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { normalizeTitle, opts } from "@/utils/helpers";
import { Image, Tab, Tabs } from "@nextui-org/react";
import { type ReactNode, use, useCallback, useEffect } from "react";
import { EventViewerCtx, PreloadedEventsCtx } from "../../ctx/event";
import { type SignedEvent } from "../../ctx/event/preload";
import {
  ActionPanel,
  GetTicketButton,
  EventGroupDetail,
  EventViewerFooter,
  InfoGrid,
  ClaimedTicketButton,
} from "./components";

export const EventViewer = () => {
  const { open, toggle } = use(EventViewerCtx)!;
  const { selectedEvent } = use(PreloadedEventsCtx)!;

  useEffect(() => {
    if (selectedEvent) {
      console.log("on-render", selectedEvent.views);
    }
  }, [selectedEvent]);

  return (
    <SideVaul
      open={open}
      onOpenChange={toggle}
      direction="right"
      title={"Event Viewer"}
      description={"View event details."}
      dismissible
    >
      <FlatWindow
        closeFn={toggle}
        icon="Upcoming"
        title="Starts in 32 days"
        variant="god"
        className="absolute z-50 w-full rounded-none border-0 bg-transparent backdrop-blur-0"
        wrapperStyle="border-gray-500 md:border-l-2"
      >
        <Container>
          <MediaContainer event={selectedEvent} />
        </Container>
      </FlatWindow>
    </SideVaul>
  );
};
const Container = ({ children }: { children: ReactNode }) => (
  <div className={cn("h-screen md:h-full", "w-full")}>{children}</div>
);

interface MediaContainerProps {
  event: SignedEvent | null | undefined;
}
const MediaContainer = ({ event }: MediaContainerProps) => {
  const { activeEventInfo, moments } = use(EventViewerCtx)!;

  const event_name = normalizeTitle(event?.event_name);

  const EventTicketButton = useCallback(() => {
    const options = opts(
      <ClaimedTicketButton is_private={event?.is_private} />,
      <GetTicketButton
        is_private={event?.is_private}
        ticket_value={event?.ticket_value}
      />,
    );
    return <>{options.get(false)}</>;
  }, [event?.is_private, event?.ticket_value]);

  return (
    <div className="mx-auto h-screen w-full max-w-6xl overflow-y-scroll font-inter tracking-tight md:h-full md:w-[30rem]">
      <div className="group/media overflow-hidden">
        <Tabs
          size="sm"
          variant="solid"
          className={cn(
            "absolute right-3 top-2 z-50 rounded-bl-md",
            "-translate-y-12 group-hover/media:translate-y-0",
            "transition-all duration-300 ease-in-out",
          )}
          color="primary"
          radius="none"
          classNames={{
            tabList:
              "p-0 border-l-[0.33px] border-b-[0.33px] gap-0 h-7 border-gray-400/40",
            tabContent: "",
            tab: "bg-gray-300 transition-all duration-100 data-[selected=true]:text-chalk data-[hover=true]:opacity-100 data-[hover=true]:bg-white",
            base: "",
            panel: "p-0",
            cursor: "shadow-none",
          }}
        >
          <Tab key={"overview"} title="Overview">
            <div className="relative h-fit">
              <Image
                radius="none"
                alt={`${event?.event_name}-cover`}
                src={event?.cover_src ?? "/svg/star_v2.svg"}
                className="relative z-0 size-full"
              />
              <TitleDisplay
                event_name={event_name}
                narrow={moments.narrow}
                time={moments.start_time.compact}
              />
            </div>
          </Tab>
          <Tab key={"details"} title="Details">
            <div className="relative h-80"></div>
          </Tab>
        </Tabs>
      </div>

      <EventTicketButton />
      <ActionPanel />
      <EventGroupDetail
        host_name={event?.host_name}
        event_geo={event?.event_geo}
        event_url={event?.event_url}
        host_id={event?.host_id}
      />
      <InfoGrid data={activeEventInfo} />
      <EventViewerFooter />
    </div>
  );
};

interface TitleDisplayProps {
  event_name: (string | undefined)[];
  narrow: { day: string; date: string };
  time: string;
}
const TitleDisplay = ({ event_name, narrow, time }: TitleDisplayProps) => (
  <div className="absolute bottom-0 left-0 z-10 w-fit space-y-0.5 rounded-sm bg-void/40 py-3 backdrop-blur-sm md:bottom-2 md:left-2">
    <p className="w-fit space-x-1.5 rounded-e-xl bg-void/60 px-1.5 py-0.5 text-xs uppercase tracking-wide text-peach">
      <span>{narrow.day}</span> <span>{narrow.date}</span> <span>{time}</span>
    </p>
    <div className="px-3">
      {event_name?.map((word, i) => (
        <h2
          key={i}
          className="block w-fit text-3xl font-bold leading-8 tracking-tight text-white drop-shadow-sm first-line:max-w-[16ch]"
        >
          {word}
        </h2>
      ))}
    </div>
  </div>
);
