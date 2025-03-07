import { getUserID } from "@/app/actions";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { type XEvent } from "@/app/types";
import { guid } from "@/utils/helpers";
import { type UserTicket } from "convex/events/d";
import { useCallback } from "react";
import { updateUserTickets } from "./actions";

export const useTicketCart = (
  xEvent: XEvent | undefined,
  ticketCount: number,
) => {
  const getVIPTicket = useCallback(async () => {
    const user_id = await getUserID();
    if (!user_id) return null;

    if (xEvent) {
      const {
        event_id,
        event_name,
        event_url,
        start_date,
        end_date,
        ticket_price,
      } = xEvent;
      if (!ticket_price) {
        onWarn("Ticket is unavailable.");
        return null;
      }
      const tickets: UserTicket[] = Array.from({ length: ticketCount }).map(
        (_, i) => ({
          event_id: event_id,
          ticket_id: guid(),
          ticket_index: i + 1,
          ticket_count: ticketCount,
          event_name: event_name!,
          event_url: event_url ?? "",
          event_start: start_date!,
          event_end: end_date ?? 0,
          event_date: start_date!,
          ticket_type: "private",
          ticket_class: "vip",
          ticket_price: Number(ticket_price),
        }),
      );

      const response = await updateUserTickets(user_id, tickets);
      if (response === "success") {
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    }
  }, [xEvent, ticketCount]);

  const getBasicTicket = useCallback(async () => {
    const user_id = await getUserID();
    if (!user_id) return null;

    if (xEvent) {
      const {
        event_id,
        event_name,
        event_url,
        start_date,
        end_date,
        ticket_price,
      } = xEvent;

      console.log(ticket_price);
      if (!ticket_price) {
        onWarn("Ticket is unavailable.");
        return null;
      }
      const tickets: UserTicket[] = Array.from({ length: ticketCount }).map(
        (_, i) => ({
          event_id,
          ticket_id: guid(),
          ticket_index: i + 1,
          ticket_count: ticketCount,
          event_name: event_name!,
          event_url: event_url ?? "",
          event_start: start_date!,
          event_end: end_date ?? 0,
          event_date: start_date!,
          ticket_type: "public",
          ticket_class: "basic",
          ticket_price: Number(ticket_price), // Assuming a default value for basic tickets
        }),
      );

      const response = await updateUserTickets(user_id, tickets);
      if (response === "success") {
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    }
  }, [xEvent, ticketCount]);

  return { getVIPTicket, getBasicTicket };
};
