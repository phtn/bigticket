import { type SelectEvent } from "convex/events/d";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useConvexCtx } from "../convex";
import type { XEvent } from "@/app/types";
import { Err } from "@/utils/helpers";
import { useQuery } from "convex/react";
import { api } from "@vx/api";

interface EventsContextValue {
  events: XEvent[];
  loading: boolean;
  selectedEvent: XEvent | null;
  selectEvent: (eventId: string | null) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const { vxFiles } = useConvexCtx();
  const [events, setEvents] = useState<XEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<XEvent | null>(null);

  const allEvents: SelectEvent[] | undefined = useQuery(api.events.get.all);

  // Initialize events from preloaded data or fetch them
  const initializeEvents = useCallback(async () => {
    try {
      setLoading(true);
      const eventsToProcess = allEvents;

      if (!eventsToProcess) {
        setEvents([]);
        return;
      }

      // Process events in parallel
      const processedEvents = await Promise.all(
        eventsToProcess.map(
          async (event): Promise<XEvent> => ({
            ...event,
            cover_src: event.cover_url
              ? await vxFiles.getUrl(event.cover_url)
              : null,
          }),
        ),
      );

      setEvents(processedEvents);

      // Initialize bookmarks and likes
      // const bookmarked = new Set(
      //   processedEvents.filter((e) => e.bookmarks).map((e) => e.event_id),
      // );
      // const liked = new Set(
      //   processedEvents.filter((e) => e.likes).map((e) => e.event_id),
      // );
    } catch (error) {
      console.error("Failed to initialize events:", error);
    } finally {
      setLoading(false);
    }
  }, [allEvents, vxFiles]);

  useEffect(() => {
    initializeEvents().catch(Err);
  }, [initializeEvents]);

  const selectEvent = useCallback(
    (eventId: string | null) => {
      if (!eventId) {
        setSelectedEvent(null);
        return;
      }
      const event = events.find((e) => e.event_id === eventId);
      setSelectedEvent(event ?? null);
    },
    [events],
  );

  const value = useMemo(
    () => ({
      events,
      loading,
      selectedEvent,
      selectEvent,
    }),
    [events, loading, selectedEvent, selectEvent],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
