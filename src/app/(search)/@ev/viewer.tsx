import { useEvents } from "@/app/_components_/home/useEvents";
import { VxCtx } from "@/app/ctx/convex/vx";
import { type XEvent } from "@/app/types";
import { useDime } from "@/hooks/useDime";
import { usePops } from "@/hooks/usePops";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
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
import { ViewTicket } from "./components/buttons/claimed";
import { GetTickets } from "./components/buttons/paid";
import {
  ClaimedTicketsGate,
  HasClaimedTickets,
  IsPrivateEvent,
  IsVIP,
  PrivateEventGate,
  VIPGate,
} from "./components/buttons/ticket-gates";
import { VIPAccess, VIPNoAccess } from "./components/buttons/vip";
import { useEventInfo } from "./useEventInfo";
import { useEventViewer, type Moments } from "./useEventViewer";
import { useTicketCart } from "./useTicketCart";
import MultiMediaCarousel, { type MediaItem } from "@/ui/carousel/m-card";
import { Carousel, useCarousel } from "@/ui/carousel";

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
        title=""
        variant={xEvent?.is_cover_light ? undefined : "void"}
        className={cn("absolute z-50 w-full rounded-none border-0")}
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

  const isVip = useMemo(
    () => IsVIP(xEvent?.vip_list, vx?.email),
    [xEvent?.vip_list, vx?.email],
  );
  const isPrivate = useMemo(
    () => IsPrivateEvent(xEvent?.is_private),
    [xEvent?.is_private],
  );
  const hasClaimed = useMemo(
    () => HasClaimedTickets(isVip, xEvent?.vip_list, vx?.email),
    [isVip, xEvent?.vip_list, vx?.email],
  );

  const ticketCount = useMemo(
    () =>
      xEvent?.vip_list?.find((t) => t.email === vx?.email)?.ticket_count ?? 0,
    [xEvent?.vip_list, vx?.email],
  );

  const ticketCart = useTicketCart(xEvent, vx?.email, ticketCount);

  const handleGetTickets = useCallback(async () => {
    if (isVip) {
      return await ticketCart?.getVIPTicket();
    }
    return await ticketCart?.getBasicTicket();
  }, [ticketCart, isVip]);

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

  const event_name = xEvent?.event_name ?? null;

  const mediaGallery = useMemo(() => {
    const mediaItems =
      xEvent?.gallery?.map((item) => ({
        type: item.type,
        src: item.src,
        alt: item.alt,
        title: item.title,
        description: item.description,
      })) ?? [];
    return mediaItems as MediaItem[];
  }, [xEvent?.gallery]);
  useEffect(() => {
    console.table({ isVip, isPrivate, hasClaimed });
  }, [isVip, isPrivate, hasClaimed]);
  const TicketClaims = useCallback(
    ({ h }: { h: string }) => {
      return (
        <div style={{ height: h }}>
          <ClaimedTicketsGate
            check={hasClaimed}
            fallback={
              <ViewTicket ticketCount={ticketCount} fn={handleViewTickets} />
            }
          >
            <VIPGate
              check={isVip}
              fallback={
                <PrivateEventGate check={isPrivate} fallback={<VIPNoAccess />}>
                  <GetTickets fn={handleGetTickets} />
                </PrivateEventGate>
              }
            >
              <VIPAccess ticketCount={ticketCount} fn={handleGetTickets} />
            </VIPGate>
          </ClaimedTicketsGate>
        </div>
      );
    },
    [
      ticketCount,
      handleGetTickets,
      handleViewTickets,
      hasClaimed,
      isVip,
      isPrivate,
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
      <Carousel className="w-full">
        <MediaComponent
          event_name={event_name ?? null}
          visible={visible}
          narrow={moments.narrow}
          time={moments.start_time.compact}
          cover_src={xEvent?.cover_src ?? null}
          ref={ref}
          gallery={mediaGallery}
        />
      </Carousel>

      <div>
        <TicketClaims h={contentHeight} />
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
  <div className="absolute bottom-0 left-0 z-10 w-fit animate-enter space-y-0.5 rounded-sm bg-void/20 py-3 backdrop-blur-sm md:bottom-2 md:left-2">
    <p className="w-fit space-x-1.5 rounded-e-xl bg-void/60 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-tighter text-chalk opacity-70 md:text-tiny">
      <span>{narrow.day}</span>
      <span>{narrow.date}</span> <span>{time}</span>
    </p>
    <div className="px-3">
      <h2 className="block w-screen text-lg font-bold leading-8 tracking-tighter text-white drop-shadow-sm first-line:max-w-[16ch] md:w-fit md:max-w-[18ch] md:text-3xl">
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
  gallery: MediaItem[];
}

const MediaComponent = ({
  visible,
  cover_src,
  event_name,
  narrow,
  time,
  ref,
  gallery,
}: MediaProps) => {
  //Su6kidaGW_8
  const { currentIndex } = useCarousel();

  const data: MediaItem[] = useMemo(
    () => [
      {
        type: "image",
        title: "cover-for-" + event_name,
        src: cover_src ?? "/svg/star_v2.svg",
        alt: `${event_name}-cover`,
      },
      ...gallery,
    ],
    [cover_src, event_name, gallery],
  );

  return (
    <div className="group/media relative overflow-hidden">
      {/* <div className="relative h-[250px]" ref={ref}>
        <Image
          radius="none"
          alt={`${event_name}-cover`}
          src={cover_src ?? "/svg/star_v2.svg"}
          className="relative z-0 aspect-auto h-auto w-screen md:w-[30rem]"
        />

      </div> */}
      <MultiMediaCarousel ref={ref} data={data} />
      {visible && currentIndex === 0 && (
        <TitleDisplay event_name={event_name} narrow={narrow} time={time} />
      )}
    </div>
  );
};

/*

<PrivateEventGate
            check={isPrivate}
            fallback={
              <VIPAccess ticketCount={ticketCount} fn={handleGetTickets} />
            }
          >
            <VIPGate
              check={isVip}
              fallback={<VIPNoAccess fn={handleGetTickets} />}
            >
              <ClaimedTicketsGate
                check={hasClaimed}
                fallback={
                  <ViewTicket
                    ticketCount={ticketCount}
                    fn={handleViewTickets}
                  />
                }
              >
                <GetTickets fn={handleGetTickets} />
              </ClaimedTicketsGate>
            </VIPGate>
          </PrivateEventGate>
*/
