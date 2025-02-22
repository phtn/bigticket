import { useEvents } from "@/app/_components_/home/useEvents";
import { VxCtx } from "@/app/ctx/convex/vx";
import { type XEvent } from "@/app/types";
import { useDime } from "@/hooks/useDime";
import { usePops } from "@/hooks/usePops";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { opts } from "@/utils/helpers";
import { Image } from "@nextui-org/react";
import { type api } from "@vx/api";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ActionPanel,
  EventGroupDetail,
  EventViewerFooter,
  InfoGrid,
} from "./components";
import { ClaimedTicketButton } from "./components/buttons/claimed";
import { GetTicketButton } from "./components/buttons/paid";
import { VIPButton } from "./components/buttons/vip";
import { useEventInfo } from "./useEventInfo";
import { type Moments, useEventViewer } from "./useEventViewer";
import { useTicketCart } from "./useTicketCart";

export interface EventViewerProps {
  preloadedEvents: Preloaded<typeof api.events.get.all>;
}
export const EventViewer = ({ preloadedEvents }: EventViewerProps) => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("x");
  const events = usePreloadedQuery(preloadedEvents);
  const { xEvents } = useEvents(events);
  const { xEvent, moments } = useEventViewer({ xEvents, eventId });
  const { open, toggle } = useToggle();
  const router = useRouter();

  const handleCloseDrawer = useCallback(() => {
    router.push("/", { scroll: false });
    toggle();
  }, [toggle, router]);

  usePops(open, toggle);

  return (
    <SideVaul
      open={!!eventId}
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
        // variant={xEvent?.is_cover_light ? "goddess" : "void"}
        variant={false ? "goddess" : "void"}
        className="absolute z-50 w-full rounded-none border-0 bg-transparent/10"
        wrapperStyle="border-gray-500 md:border-l-2"
      >
        <Container>
          <MediaContainer xEvent={xEvent} moments={moments} />
        </Container>
      </FlatWindow>
    </SideVaul>
  );
};
const Container = ({ children }: { children: ReactNode }) => (
  <div className={cn("", "w-full")}>{children}</div>
);

interface MediaContainerProps {
  xEvent: XEvent | undefined;
  moments: Moments;
}

const MediaContainer = ({ xEvent, moments }: MediaContainerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { screen } = useDime(ref);
  const router = useRouter();
  const { xEventInfo, panelItems } = useEventInfo(xEvent);
  const { vx } = use(VxCtx)!;

  // const isClaimed = useMemo(() => {
  //   const userInEvent =
  //     counter?.tickets?.findIndex(
  //       (ticket) => ticket.event_id === xEvent?.event_id,
  //     ) !== -1;
  //   const userHasTickets =
  //     counter?.tickets?.findIndex((ticket) => ticket.user_id === user_id) !==
  //     -1;
  //   return userInEvent ? userHasTickets : false;
  // }, [counter, user_id, xEvent?.event_id]);

  const ticketCart = useTicketCart(xEvent, vx?.email);

  const is_vip = useMemo(() => {
    if (!xEvent?.vip_list || !vx?.email) return false;
    return xEvent.vip_list?.findIndex((vip) => vip.email === vx?.email) !== -1;
  }, [xEvent?.vip_list, vx?.email]);

  const ticket_count = useMemo(
    () => xEvent?.vip_list?.find((t) => t.email === vx?.email)?.ticket_count,
    [xEvent?.vip_list, vx?.email],
  );

  const handleGetTickets = useCallback(async () => {
    if (!vx?.email || !xEvent) return;
    if (is_vip) {
      return await ticketCart?.getVIPTicket();
    }
    return await ticketCart?.getBasicTicket();
  }, [ticketCart, xEvent, is_vip, vx?.email]);

  const handleViewTickets = useCallback(() => {
    if (!vx?.email) return;
    router.push("/account/tickets");
  }, [router, vx?.email]);

  const [debounced, setDebounced] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!debounced) {
        setDebounced(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [debounced]);
  // const event_name = normalizeTitle(xEvent?.event_name);
  const event_name = xEvent?.event_name ?? null;

  const ClaimedOptions = useCallback(
    ({ h }: { h: string }) => {
      const options = opts(
        <ClaimedTicketButton
          h={h}
          is_vip={is_vip}
          count={ticket_count}
          is_private={xEvent?.is_private}
          fn={handleViewTickets}
        />,
        <VIPButton
          debounced={debounced}
          h={h}
          count={ticket_count}
          is_private={xEvent?.is_private}
          ticket_price={xEvent?.ticket_value}
          fn={handleGetTickets}
        />,
      );
      return <>{options.get(false)}</>;
    },
    [
      is_vip,
      ticket_count,
      handleGetTickets,
      handleViewTickets,
      xEvent?.is_private,
      xEvent?.ticket_value,
      debounced,
    ],
  );

  const EventTicketButton = useCallback(
    (props: { h: string }) => {
      const options = opts(
        <ClaimedOptions h={props.h} />,
        <GetTicketButton
          h={props.h}
          is_vip={is_vip}
          count={ticket_count}
          is_private={xEvent?.is_private}
          ticket_value={xEvent?.ticket_value}
          fn={handleGetTickets}
        />,
      );
      return <>{options.get(false)}</>;
    },
    [
      is_vip,
      ticket_count,
      handleGetTickets,
      xEvent?.is_private,
      xEvent?.ticket_value,
      ClaimedOptions,
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
      <MediaComponent
        event_name={event_name ?? null}
        visible={visible}
        narrow={moments.narrow}
        time={moments.start_time.compact}
        cover_src={xEvent?.cover_src ?? null}
        ref={ref}
      />

      <div>
        <EventTicketButton h={contentHeight} />
        <ActionPanel h={contentHeight} data={panelItems} />
        <EventGroupDetail
          debounced={debounced}
          host_name={xEvent?.host_name}
          event_url={xEvent?.event_url}
          is_online={xEvent?.event_type === "online"}
          host_id={xEvent?.host_id}
          event_venue={`${xEvent?.venue_name ?? xEvent?.event_geo ?? "Not set"}---${xEvent?.venue_address ?? ""}`}
          h={contentHeight}
        />
        <InfoGrid data={xEventInfo} h={contentHeight} />
      </div>
      <EventViewerFooter h={contentHeight} />
    </div>
  );
};

interface TitleDisplayProps {
  event_name: string | null;
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
    </div>
  </div>
);

interface MediaProps {
  cover_src: string | null;
  event_name: string | null;
  narrow: { day: string; date: string };
  time: string;
  visible?: boolean;
  ref: RefObject<HTMLDivElement | null>;
}

const MediaComponent = ({
  visible,
  cover_src,
  event_name,
  narrow,
  time,
  ref,
}: MediaProps) => {
  return (
    <div className="group/media overflow-hidden">
      <div className="relative h-[250px]" ref={ref}>
        <Image
          radius="none"
          alt={`${event_name}-cover`}
          src={cover_src ?? "/svg/star_v2.svg"}
          className="relative z-0 aspect-auto h-auto w-screen md:w-[30rem]"
        />
        {visible && (
          <TitleDisplay event_name={event_name} narrow={narrow} time={time} />
        )}
      </div>
    </div>
  );
};
