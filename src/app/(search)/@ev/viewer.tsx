import { useEvents } from "@/app/(search)/home/useEvents";
import { useUserCtx } from "@/app/ctx/user";
import { type XEvent } from "@/app/types";
import { useDime } from "@/hooks/useDime";
import { usePops } from "@/hooks/usePops";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { Carousel, useCarousel } from "@/ui/carousel";
import MultiMediaCarousel, { type MediaItem } from "@/ui/carousel/m-card";
import { Shimmer } from "@/ui/text/sparkles";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { clearConsole } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { api } from "@vx/api";
import { type SelectEvent } from "convex/events/d";
import { useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  memo,
} from "react";
import {
  ActionPanel,
  EventGroupDetail,
  EventViewerFooter,
  InfoGrid,
} from "./components";
import { Cart } from "./components/buttons/cart";
import { useCart } from "./components/buttons/cart/ctx";
import { useCartStore } from "./components/buttons/cart/useCartStore";
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
import { type SelectUser } from "convex/users/d";

export const EventViewer = () => {
  const allEvents = useQuery(api.events.get.all);
  const [events, setEvents] = useState<SelectEvent[]>();

  useEffect(() => {
    localStorage.removeItem("bigticket_cart");
    localStorage.removeItem("bigticket_pcs");
    if (allEvents) {
      setEvents(allEvents);
    }
  }, [allEvents]);

  const searchParams = useSearchParams();
  const eventId = searchParams.get("x");
  const { xEvents } = useEvents(events ?? []);
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

// Custom hook for ticket management
const useTicketManagement = (
  xEvent: XEvent | undefined,
  xUser: SelectUser | undefined,
) => {
  const [hasClaimed, setHasClaimed] = useState(false);

  const isVip = useMemo(
    () => IsVIP(xEvent?.vip_list, xUser?.email),
    [xEvent?.vip_list, xUser?.email],
  );

  const isPrivate = useMemo(
    () => IsPrivateEvent(xEvent?.is_private),
    [xEvent?.is_private],
  );

  const ticketCount = useMemo(
    () =>
      xEvent?.vip_list?.find((t) => t.email === xUser?.email)?.ticket_count ??
      0,
    [xEvent?.vip_list, xUser?.email],
  );

  useEffect(() => {
    startTransition(() => {
      setHasClaimed(HasClaimedTickets(isVip, xEvent?.vip_list, xUser?.email));
    });
  }, [isVip, xEvent?.vip_list, xUser?.email]);

  return { hasClaimed, isVip, isPrivate, ticketCount };
};

// Optimize MediaContainer
const MediaContainer = memo(({ xEvent, moments }: MediaContainerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { screen } = useDime(ref);
  const router = useRouter();
  const { xEventInfo, panelItems } = useEventInfo(xEvent);
  const { xUser } = useUserCtx();
  const { open, toggle } = useCart();

  const { hasClaimed, isVip, isPrivate, ticketCount } = useTicketManagement(
    xEvent,
    xUser,
  );
  const ticketCart = useTicketCart(xEvent, ticketCount);

  const handleGetTickets = useCallback(async () => {
    if (isVip) {
      return await ticketCart?.getVIPTicket();
    }
    return await ticketCart?.getBasicTicket(xUser?.id);
  }, [ticketCart, isVip, xUser?.id]);

  const handleViewTickets = useCallback(() => {
    router.push("/account/tickets");
  }, [router]);

  const [debounced, setDebounced] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!debounced) {
        setDebounced(true);
      }
    }, 3000);
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

  const TicketClaims = useCallback(
    ({ h }: { h: string }) =>
      debounced ? (
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
                  <GetTickets
                    ticketPrice={xEvent?.ticket_price}
                    fn={handleGetTickets}
                  />
                </PrivateEventGate>
              }
            >
              <VIPAccess ticketCount={ticketCount} fn={handleGetTickets} />
            </VIPGate>
          </ClaimedTicketsGate>
        </div>
      ) : (
        <div
          style={{ height: h }}
          className="flex items-center justify-center space-x-6 bg-void"
        >
          <Shimmer
            sparklesCount={6}
            className="font-inter text-[16px]"
            text="Getting"
          />
          <Spinner size="sm" color="secondary" />
          <Shimmer
            sparklesCount={6}
            className="font-inter text-[16px]"
            text="Ticket"
          />
        </div>
      ),
    [
      ticketCount,
      handleGetTickets,
      handleViewTickets,
      hasClaimed,
      isVip,
      isPrivate,
      xEvent?.ticket_price,
      debounced,
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
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const { setEventDetails } = useCartStore();

  useEffect(() => {
    setEventDetails({
      eventId: xEvent?.event_id,
      eventName: xEvent?.event_name,
      eventDate: xEvent?.start_date,
      eventVenue: xEvent?.venue_name ?? xEvent?.event_geo ?? "Not set",
      eventAddress: xEvent?.venue_address ?? "",
      eventOrganizer: xEvent?.host_name,
    });
  }, [xEvent, setEventDetails]);

  return (
    <div className="mx-auto h-[calc(100vh-64px)] w-full max-w-6xl overflow-y-scroll font-inter tracking-tight md:h-full md:w-[30rem]">
      <Carousel className="w-full">
        <MediaComponent
          ref={ref}
          visible={visible}
          event_name={event_name ?? null}
          narrow={moments.narrow}
          time={moments.start_time.compact}
          cover_src={xEvent?.cover_src ?? null}
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
        <Cart open={open} toggle={toggle} ticketPrice={xEvent?.ticket_price} />
      </div>
      <EventViewerFooter h={contentHeight} />
    </div>
  );
});

MediaContainer.displayName = "MediaContainer";

interface TitleDisplayProps {
  event_name: string | null;
  narrow: { day: string; date: string };
  time: string;
}
const TitleDisplay = memo(({ event_name, narrow, time }: TitleDisplayProps) => (
  <div className="absolute bottom-0 left-0 z-10 w-fit animate-enter space-y-0.5 rounded-sm bg-coal/30 py-3 backdrop-blur-sm md:bottom-2 md:left-2 md:rounded-lg">
    <p className="w-fit space-x-1.5 rounded-e-xl border-b-[0.25px] border-secondary bg-void/60 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-tighter text-chalk opacity-70 md:text-tiny">
      <span>{narrow.day}</span>
      <span>{narrow.date}</span> <span>{time}</span>
    </p>
    <div className="px-3">
      <h2 className="block w-screen text-lg font-bold leading-8 tracking-tighter text-white drop-shadow-sm first-line:max-w-[16ch] md:w-fit md:max-w-[16ch] md:text-xl md:font-black md:tracking-tight">
        {event_name}
      </h2>
    </div>
  </div>
));

TitleDisplay.displayName = "TitleDisplay";

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
  const { currentIndex } = useCarousel();
  const [src, setSrc] = useState<string>("/png/wordmark.png");

  useEffect(() => {
    clearConsole();
    startTransition(() => {
      if (!!cover_src) {
        setSrc(cover_src);
      }
    });
  }, [cover_src]);

  const data: MediaItem[] = useMemo(
    () => [
      {
        type: "image",
        title: "cover-for-" + event_name?.toLowerCase(),
        src: src,
        alt: `${event_name?.toLowerCase()}-cover`,
      },
      ...gallery,
    ],
    [event_name, gallery, src],
  );

  return (
    <div className="group/media relative overflow-hidden">
      <MultiMediaCarousel ref={ref} data={data} />
      {visible && currentIndex === 0 && (
        <TitleDisplay event_name={event_name} narrow={narrow} time={time} />
      )}
    </div>
  );
};
