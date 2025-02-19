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
import { AuthCtx } from "../auth";

interface TicketCtxValues {
  getTicket: (activeEvent: SelectEvent | null) => Promise<string | null>;
  user_id: string | undefined;
  user_email: string | undefined;
  count: number
}
export const TicketCtx = createContext<TicketCtxValues | null>(null);

export const TicketCtxProvider = ({ children }: { children: ReactNode }) => {
  const { usr } = use(ConvexCtx)!;
  const { user } = use(AuthCtx)!

  const [user_id, setUserId] = useState<string>();
  const [count, setCount] = useState<number>(0);
  const getUserId = useCallback(async () => {
    setUserId(await getUserID());
  }, []);

  useEffect(() => {
    getUserId().catch(Err);
  }, [getUserId]);


  const getTicket = useCallback(
    async (e: SelectEvent | null) => {
      if (!e || !user_id) return null;

      let ticket_count = 0
      const is_vip = e.vip_list?.find((vip) => vip.email === user?.email)
      if (is_vip?.ticket_count && !is_vip?.tickets_claimed) {
        ticket_count = is_vip.ticket_count ?? 0;
      }
      console.log(ticket_count)
      if (!ticket_count) return null;
      setCount(ticket_count);

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

      const response = await usr.update.tickets(user_id, tickets);
      if (response === "success") {
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    },
    [user_id, usr.update, user],
  );

  const value = useMemo(
    () => ({
      count,
      getTicket,
      user_id,
      user_email: user?.email,
    }),
    [count, getTicket, user_id, user?.email],
  );
  return <TicketCtx value={value}>{children}</TicketCtx>;
};
