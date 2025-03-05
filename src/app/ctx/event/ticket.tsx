"use client";

import { guid } from "@/utils/helpers";
import type { SelectEvent, UserTicket } from "convex/events/d";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useConvexCtx } from "../convex";
import { onSuccess, onWarn } from "../toast";
import { getUserID } from "@/app/actions";
import { useAuthStore } from "../auth/store";

interface TicketCtxValues {
  getVIPTicket: (event: SelectEvent | null) => Promise<string | null>;
  getBasicTicket: (event: SelectEvent | null) => Promise<string | null>;
  user_email: string | undefined;
  count: number;
}
export const TicketCtx = createContext<TicketCtxValues | null>(null);

export const TicketCtxProvider = ({ children }: { children: ReactNode }) => {
  const { vxUsers } = useConvexCtx();
  const { user } = useAuthStore();

  const [count, setCount] = useState<number>(0);

  const updateUserTickets = useCallback(
    async (id: string, tickets: UserTicket[]) =>
      (await vxUsers.mut.updateUserTickets({ id, tickets })) as Promise<
        string | null
      >,
    [vxUsers.mut],
  );

  const getVIPTicket = useCallback(
    async (e: SelectEvent | null) => {
      const user_id = await getUserID();
      if (!e || !user_id) return null;

      let ticket_count = 0;
      const is_vip = e.vip_list?.find((vip) => vip.email === user?.email);
      if (is_vip?.ticket_count && !is_vip?.tickets_claimed) {
        ticket_count = is_vip.ticket_count ?? 0;
      }
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

      if (!ticket_value) {
        onWarn("Ticket is unavailable.");
        return null;
      }
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
          ticket_class: "vip",
          ticket_value: Number(ticket_value),
        }),
      );

      const response = await updateUserTickets(user_id, tickets);
      if (response === "success") {
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    },
    [user?.email, updateUserTickets],
  );

  const getBasicTicket = useCallback(
    async (e: SelectEvent | null) => {
      const user_id = await getUserID();
      if (!e || !user_id) return null;

      const ticket_count = 1; // Assuming 1 ticket per user for basic tickets
      setCount(ticket_count);

      const {
        event_id,
        event_name,
        event_url,
        start_date,
        end_date,
        ticket_value,
      } = e;

      if (!ticket_value) {
        onWarn("Ticket is unavailable.");
        return null;
      }

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
          ticket_type: "public",
          ticket_class: "basic",
          ticket_value, // Assuming a default value for basic tickets
        }),
      );

      const response = await updateUserTickets(user_id, tickets);
      if (response === "success") {
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    },
    [updateUserTickets],
  );

  const value = useMemo(
    () => ({
      count,
      getVIPTicket,
      getBasicTicket,
      user_email: user?.email,
    }),
    [count, getVIPTicket, getBasicTicket, user?.email],
  );

  return <TicketCtx.Provider value={value}>{children}</TicketCtx.Provider>;
};
