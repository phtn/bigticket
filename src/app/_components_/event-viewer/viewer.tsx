import { SideVaul } from "@/ui/vaul";
import { type ReactNode, use, useMemo } from "react";
import { EventViewerCtx, PreloadedEventsCtx } from "../../ctx/event";
import { FlatWindow } from "@/ui/window";
import { cn } from "@/lib/utils";
import { Button, Card, Image, Tab, Tabs } from "@nextui-org/react";
import { type SignedEvent } from "../../ctx/event/preload";
import { Icon, type IconName } from "@/icons";
import { HyperList } from "@/ui/list";
import { normalizeTitle } from "@/utils/helpers";
import { useMoment } from "@/hooks/useMoment";

export const EventViewer = () => {
  const { open, toggle } = use(EventViewerCtx)!;
  const preloaded = use(PreloadedEventsCtx);

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
        className="rounded-none border-0 bg-void"
        wrapperStyle="border-gray-700 md:border-l-2"
      >
        <Container>
          <MediaContainer event={preloaded?.selectedEvent} />
        </Container>
      </FlatWindow>
    </SideVaul>
  );
};
const Container = ({ children }: { children: ReactNode }) => (
  <div className={cn("h-screen md:h-[86.5vh]", "w-full")}>{children}</div>
);

interface MediaContainerProps {
  event: SignedEvent | null | undefined;
}
const MediaContainer = ({ event }: MediaContainerProps) => {
  const { start_time } = useMoment({
    date: event?.event_date,
    start: event?.start_date,
    end: event?.end_date,
  });
  const info_grid_data: InfoItem[] = useMemo(
    () => [
      { label: "Ticket Sales", value: "OPEN" },
      { label: "Tickets Sold", value: "780" },
      { label: "Tickets Remaining", value: "50" },
      { label: "Date", value: "" },
      { label: "Time", value: "12:59PM-12:59AM" },
      { label: "Duration", value: "3 hours" },
      { label: "Likes", value: "380" },
      { label: "Views", value: "1,210" },
      { label: "Favorites", value: "2,680" },
    ],
    [],
  );

  const event_name = normalizeTitle(event?.event_name);
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
            <div className="relative h-72">
              <Image
                radius="none"
                alt={`${event?.event_name}-cover`}
                src={event?.cover_src ?? "/svg/star_v2.svg"}
                className="relative z-0 size-full"
              />
              <div className="absolute bottom-2 left-2 z-10 w-fit space-y-0.5 rounded-sm bg-void/40 py-3 backdrop-blur-sm">
                <p className="w-fit rounded-e-xl bg-void/60 px-1.5 py-0.5 text-xs tracking-wide text-peach">
                  THU 10/08 {start_time.compact}
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
            </div>
          </Tab>
          <Tab key={"details"} title="Details">
            <div className="relative h-72"></div>
          </Tab>
        </Tabs>
      </div>

      <div className="z-1 relative bg-primary">
        <Button
          disableRipple
          size="lg"
          color="primary"
          className="h-16"
          fullWidth
          radius="none"
        >
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold">Get Tickets</span>
            <span className="text-xl font-bold">&rarr;</span>
            <div className="rounded-sm px-4 py-1 text-2xl">$0.00</div>
          </div>
        </Button>
      </div>

      <ActionPanel />
      <div className="h-32 md:h-28">
        <div className="flex items-center justify-between border-b-[0.33px] border-zinc-400 bg-white p-4 font-semibold md:h-14">
          <span>Organizers</span>
          <span>{event?.host_name}</span>
        </div>
        <div className="flex items-center justify-between border-b-[0.33px] border-zinc-400 bg-white p-4 font-medium md:h-14">
          <span>Location</span>
          <span>{event?.event_geo ?? event?.event_url}</span>
        </div>
      </div>
      <HyperList
        delay={0.7}
        data={info_grid_data}
        component={InfoGridItem}
        container="grid h-48 md:h-48 w-full grid-cols-3"
        keyId={"label"}
      />
      <div className="flex h-36 w-full items-center justify-end bg-peach px-2 text-xs font-light md:h-[30px]">
        Big Ticket &copy;{new Date().getFullYear()}
      </div>
    </div>
  );
};

interface InfoItem {
  label: string;
  value: string | number;
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

interface ActionItem {
  id: number;
  label: string;
  icon: IconName;
}
const ActionPanel = () => {
  const actions: ActionItem[] = useMemo(
    () => [
      {
        id: 0,
        label: "support",
        icon: "Support",
      },
      {
        id: 1,
        label: "geolocation",
        icon: "MapPin",
      },
      {
        id: 2,
        label: "website",
        icon: "Globe",
      },
      {
        id: 3,
        label: "bookmark",
        icon: "BookmarkPlus",
      },
      {
        id: 4,
        label: "share",
        icon: "Share",
      },
    ],
    [],
  );
  return (
    <HyperList
      data={actions}
      component={ActionButton}
      container="grid h-14 grid-cols-5 w-full border-b-[0.33px] border-zinc-400 bg-white font-medium"
      delay={0.3}
      direction="up"
    />
  );
};

const ActionButton = (action: ActionItem) => (
  <Button
    id={action.label}
    name={action.label}
    disableRipple
    radius="none"
    className={cn(
      "flex h-full w-full items-center justify-center bg-white p-0",
      "hover:bg-gray-200",
    )}
  >
    <Icon name={action.icon} className="size-5" />
  </Button>
);
