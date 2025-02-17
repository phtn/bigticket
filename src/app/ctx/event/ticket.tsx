"use client";

import { getUserID } from "@/app/actions";
import { Err, guid } from "@/utils/helpers";
import type { SelectEvent, UserTicket } from "convex/events/d";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConvexCtx } from "../convex";
import { onSuccess } from "../toast";

interface TicketCtxValues {
  getTicket: (activeEvent: SelectEvent | null) => Promise<string | null>;
  claimed: boolean;
}
export const TicketCtx = createContext<TicketCtxValues | null>(null);

export const TicketCtxProvider = ({ children }: { children: ReactNode }) => {
  const { usr } = use(ConvexCtx)!;

  const [user_id, setUserId] = useState<string>();
  const [claimed, setClaimed] = useState<boolean>(false);

  const getUserId = useCallback(async () => {
    setUserId(await getUserID());
  }, []);

  useEffect(() => {
    getUserId().catch(Err);
  }, [getUserId]);

  const ticket_count = useMemo(() => {
    return 5;
  }, []);

  const getTicket = useCallback(
    async (e: SelectEvent | null) => {
      if (!e || !user_id) return null;
      const {
        event_id,
        event_name,
        event_url,
        start_date,
        end_date,
        ticket_value,
      } = e;
      const tickets: UserTicket[] = Array.from({ length: ticket_count }).map(
        (_, i) => ({
          event_id,
          ticket_id: guid(),
          ticket_index: i + 1,
          ticket_count,
          event_name: event_name!,
          event_url: event_url ?? "",
          event_start: start_date!,
          event_end: end_date ?? 0,
          event_date: start_date!,
          ticket_type: "private",
          ticket_value: ticket_value ?? 100,
        }),
      );

      console.table(user_id);

      const response = await usr.update.tickets(user_id, tickets);
      if (response === "success") {
        setClaimed(true);
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    },
    [user_id, usr.update, ticket_count],
  );

  const value = useMemo(
    () => ({
      getTicket,
      claimed,
    }),
    [getTicket, claimed],
  );
  return <TicketCtx value={value}>{children}</TicketCtx>;
};
