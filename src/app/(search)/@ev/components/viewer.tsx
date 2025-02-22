import { EventViewerCtx } from "@/app/ctx/event";
import { TicketCtx } from "@/app/ctx/event/ticket";
import { useDime } from "@/hooks/useDime";
import { usePops } from "@/hooks/usePops";
import { cn } from "@/lib/utils";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { normalizeTitle, opts } from "@/utils/helpers";
import { Image, Tab, Tabs } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type PointerEvent,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActionPanel,
  ClaimedTicketButton,
  EventGroupDetail,
  EventViewerFooter,
  GetTicketButton,
  InfoGrid,
} from ".";

export const EventViewer = () => {
  const { open, toggle, activeEvent, getEvent } = use(EventViewerCtx)!;
  const router = useRouter();
  const searchParams = useSearchParams();
  const event_id = searchParams.get("x");

  useEffect(() => {
    if (event_id) {
      getEvent(event_id);
    }
  }, [event_id, getEvent]);

  const handleCloseDrawer = useCallback(() => {
    router.push("/", { scroll: false });
    toggle();
  }, [toggle, router]);

  usePops(open, toggle);

  return (
    <SideVaul
      open={!!event_id}
      onClose={handleCloseDrawer}
      onOpenChange={toggle}
      direction="right"
      title={"Event Viewer"}
      description={"View event details."}
    >
      <FlatWindow
        closeFn={handleCloseDrawer}
        icon="Fire"
        title=""
        variant={activeEvent?.is_cover_light ? "goddess" : "void"}
        className="absolute z-50 w-full rounded-none border-0 bg-transparent/10"
        wrapperStyle="border-gray-500 md:border-l-2"
      >
        <Container>
          <MediaContainer />
        </Container>
      </FlatWindow>
    </SideVaul>
  );
};
const Container = ({ children }: { children: ReactNode }) => (
  <div className={cn("", "w-full")}>{children}</div>
);

const MediaContainer = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { screen } = useDime(ref);
  const router = useRouter();

  const { activeEvent, activeEventInfo, moments, cover_src, counter, user_id } =
    use(EventViewerCtx)!;

  const isClaimed = useMemo(() => {
    const userInEvent =
      counter?.tickets?.findIndex(
        (ticket) => ticket.event_id === activeEvent?.event_id,
      ) !== -1;
    const userHasTickets =
      counter?.tickets?.findIndex((ticket) => ticket.user_id === user_id) !==
      -1;
    return userInEvent ? userHasTickets : false;
  }, [counter, user_id, activeEvent?.event_id]);

  const { getTicket, user_email } = use(TicketCtx)!;

  const is_vip = useMemo(() => {
    if (!activeEvent?.vip_list || !user_email) return false;
    return (
      activeEvent.vip_list?.findIndex((vip) => vip.email === user_email) !== -1
    );
  }, [activeEvent?.vip_list, user_email]);

  const ticket_count = useMemo(
    () =>
      activeEvent?.vip_list?.find((t) => t.email === user_email)?.ticket_count,
    [activeEvent?.vip_list, user_email],
  );

  const handleGetTickets = useCallback(async () => {
    if (is_vip) {
      await getTicket(activeEvent);
    }
  }, [getTicket, activeEvent, is_vip]);

  const handleViewTickets = useCallback(() => {
    router.push("/account/tickets");
  }, [router]);

  const event_name = normalizeTitle(activeEvent?.event_name);

  const EventTicketButton = useCallback(
    (props: { h: string }) => {
      const options = opts(
        <ClaimedTicketButton
          h={props.h}
          is_vip={is_vip}
          count={ticket_count}
          is_private={activeEvent?.is_private}
          fn={handleViewTickets}
        />,
        <GetTicketButton
          h={props.h}
          is_vip={is_vip}
          count={ticket_count}
          is_private={activeEvent?.is_private}
          ticket_value={activeEvent?.ticket_value}
          fn={handleGetTickets}
        />,
      );
      return <>{options.get(isClaimed)}</>;
    },
    [
      is_vip,
      ticket_count,
      isClaimed,
      handleGetTickets,
      handleViewTickets,
      activeEvent?.is_private,
      activeEvent?.ticket_value,
    ],
  );

  const contentHeight = useMemo(
    () => `${((screen.height - 314) / 7).toFixed(2)}px`,
    [screen.height],
  );

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mx-auto h-[calc(100vh-64px)] w-full max-w-6xl overflow-y-scroll font-inter tracking-tight md:h-full md:w-[30rem]">
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
            <div className="relative h-[250px]" ref={ref}>
              <Image
                radius="none"
                alt={`${activeEvent?.event_name}-cover`}
                src={cover_src ?? "/svg/star_v2.svg"}
                className="relative z-0 aspect-auto h-auto w-screen md:w-[30rem]"
              />
              {visible && (
                <TitleDisplay
                  event_name={event_name}
                  narrow={moments.narrow}
                  time={moments.start_time.compact}
                />
              )}
            </div>
          </Tab>
          <Tab key={"details"} title="Details">
            <div className="relative h-[278.77px] w-screen md:h-[320px]"></div>
          </Tab>
        </Tabs>
      </div>

      <div>
        <EventTicketButton h={contentHeight} />
        <ActionPanel h={contentHeight} />
        <EventGroupDetail
          host_name={activeEvent?.host_name}
          event_url={activeEvent?.event_url}
          is_online={activeEvent?.event_type === "online"}
          host_id={activeEvent?.host_id}
          event_venue={`${activeEvent?.venue_name ?? activeEvent?.event_geo ?? "Not set"}---${activeEvent?.venue_address ?? ""}`}
          h={contentHeight}
        />
        <InfoGrid data={activeEventInfo} h={contentHeight} />
      </div>
      <EventViewerFooter h={contentHeight} />
    </div>
  );
};

interface TitleDisplayProps {
  event_name: (string | undefined)[];
  narrow: { day: string; date: string };
  time: string;
}
const TitleDisplay = ({ event_name, narrow, time }: TitleDisplayProps) => (
  <div className="absolute bottom-0 left-0 z-10 w-fit animate-enter space-y-0.5 rounded-sm bg-void/40 py-3 backdrop-blur-sm md:bottom-2 md:left-2">
    <p className="w-fit space-x-1.5 rounded-e-xl bg-void/60 px-1.5 py-0.5 text-tiny font-bold uppercase tracking-tighter text-chalk opacity-70">
      <span>{narrow.day}</span> <span>{narrow.date}</span> <span>{time}</span>
    </p>
    <div className="px-3">
      <h2 className="block w-fit max-w-[18ch] text-2xl font-bold leading-8 tracking-tighter text-white drop-shadow-sm first-line:max-w-[16ch] md:text-3xl">
        {event_name}
      </h2>
      {/* {event_name?.map((word, i) => (
        <h2
          key={i}
          className="block w-fit text-2xl font-bold leading-8 tracking-tighter text-white drop-shadow-sm first-line:max-w-[16ch] md:text-3xl"
        >
          {word}
        </h2>
      ))} */}
    </div>
  </div>
);
