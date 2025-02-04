import { SideVaul } from "@/ui/vaul";
import { type ReactNode, use, useMemo } from "react";
import { EventViewerCtx, PreloadedEventsCtx } from "./ctx/event";
import { FlatWindow } from "@/ui/window";
import { cn } from "@/lib/utils";
import { Button, Card, Image, Tab, Tabs } from "@nextui-org/react";
import { type SignedEvent } from "./ctx/event/preload";
import { Icon, type IconName } from "@/icons";
import { HyperList } from "@/ui/list";

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
        title="Event starts in 32 days."
        className="rounded-none border-[0.33px] border-b-0 border-gray-700 bg-gray-100"
      >
        <Container>
          <MediaContainer event={preloaded?.selectedEvent} />
        </Container>
      </FlatWindow>
    </SideVaul>
  );
};
const Container = ({ children }: { children: ReactNode }) => (
  <div className={cn("h-[86.5vh]", "w-full")}>{children}</div>
);

interface MediaContainerProps {
  event: SignedEvent | null | undefined;
}
const MediaContainer = ({ event }: MediaContainerProps) => {
  return (
    <div className="mx-auto w-[30rem] max-w-6xl font-inter tracking-tight">
      <Tabs
        size="sm"
        variant="light"
        className="absolute left-1 top-1.5 z-50"
        radius="md"
        classNames={{
          tabList: "p-0 border gap-0 h-7 border-chalk bg-white/10",
          tabContent: " data-[selected==true]:text-void",
          tab: " rounded-none bg-white/50 data-[selected==true]:bg-void",
          base: "bg-white/10 rounded-xl",
          panel: "",
          cursor: "shadow-none rounded-none bg-transparent/30",
        }}
      >
        <Tab key={"overview"} title="Overview" />
        <Tab key={"details"} title="Details" />
      </Tabs>

      <div className="relative h-72">
        <Image
          radius="none"
          alt={`${event?.event_name}-cover`}
          src={event?.cover_src ?? "/svg/star_v2.svg"}
          className="relative z-0 size-full"
        />
        <div className="absolute bottom-4 z-10 max-w-[14ch] rounded-e-md bg-void/40 p-3 backdrop-blur-sm">
          <p className="rounded-xl bg-void/40 px-1 py-0.5 text-xs font-medium tracking-wider text-peach">
            THU 10/08 9PM
          </p>
          <h2 className="text-3xl font-bold text-white drop-shadow-sm">
            {event?.event_name}
          </h2>
        </div>
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
            <span className="text-xl font-bold">Get Ticket</span>
            <div className="border_ rounded-sm border-gray-500 px-4 py-1 text-2xl">
              $0.00
            </div>
          </div>
        </Button>
      </div>
      <div className="flex h-16 items-center justify-between border-[0.33px] border-zinc-200 bg-white p-4 font-semibold">
        <span>Organizers</span>
        <span>{event?.host_name}</span>
      </div>
      <div className="flex h-16 items-center justify-between border-[0.33px] border-zinc-200 bg-white p-4 font-medium">
        <span>Location</span>
        <span>{event?.event_geo ?? event?.event_url}</span>
      </div>
      <ActionPanel />
      {/* Stats Grid */}
      <div className="grid w-full grid-cols-3">
        {[
          { label: "Ticket Sales", value: "OPEN" },
          { label: "Sold", value: "780" },
          { label: "Remaining", value: "50" },
          { label: "Date", value: "" },
          { label: "Time", value: "12:59PM-12:59AM" },
          { label: "Duration", value: "3 hours" },
          { label: "Likes", value: "380" },
          { label: "Views", value: "1,210" },
          { label: "Favorites", value: "2,680" },
        ].map((stat, i) => (
          <Card
            key={i}
            radius="none"
            className="border-[0.33px] border-zinc-200 bg-white px-3 py-2 shadow-none"
          >
            <div className="text-xs tracking-tight">{stat.label}</div>
            <div className="font-semibold tracking-tighter">{stat.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

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
        label: "support",
        icon: "MapPin",
      },
      {
        id: 2,
        label: "support",
        icon: "BookmarkPlus",
      },
      {
        id: 3,
        label: "support",
        icon: "Share",
      },
    ],
    [],
  );
  return (
    <HyperList
      data={actions}
      component={ActionButton}
      container="grid h-12 grid-cols-4 w-full border-[0.33px] border-zinc-200 bg-white font-medium"
      delay={0.5}
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
      "hover:bg-gray-100",
    )}
  >
    <Icon name={action.icon} className="size-5" />
  </Button>
);
