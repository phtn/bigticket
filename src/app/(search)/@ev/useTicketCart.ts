import { getUserID } from "@/app/actions";
import { onSuccess, onWarn } from "@/app/ctx/toast";
import { type XEvent } from "@/app/types";
import { guid } from "@/utils/helpers";
import { type UserTicket } from "convex/events/d";
import { useCallback, useState } from "react";
import { updateUserTickets } from "./actions";

export const useTicketCart = (
  xEvent: XEvent | undefined,
  email: string | undefined,
) => {
  const [count, setCount] = useState<number>(0);

  const getVIPTicket = useCallback(async () => {
    const user_id = await getUserID();
    if (!user_id) return null;

    let ticket_count = 0;
    const isVip = xEvent?.vip_list?.find((vip) => vip.email === email);
    if (isVip?.ticket_count && !isVip?.tickets_claimed) {
      ticket_count = isVip.ticket_count ?? 0;
    }
    if (!ticket_count) return null;
    setCount(ticket_count);

    if (xEvent) {
      const {
        event_id,
        event_name,
        event_url,
        start_date,
        end_date,
        ticket_value,
      } = xEvent;
      if (!ticket_value) {
        onWarn("Ticket is unavailable.");
        return null;
      }
      const tickets: UserTicket[] = Array.from({ length: ticket_count }).map(
        (_, i) => ({
          event_id: event_id,
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
    }
  }, [email, xEvent]);

  const getBasicTicket = useCallback(async () => {
    const user_id = await getUserID();
    if (!user_id) return null;

    const ticket_count = 1; // Assuming 1 ticket per user for basic tickets
    setCount(ticket_count);

    if (xEvent) {
      const {
        event_id,
        event_name,
        event_url,
        start_date,
        end_date,
        ticket_value,
      } = xEvent;

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
          ticket_value: Number(ticket_value), // Assuming a default value for basic tickets
        }),
      );

      const response = await updateUserTickets(user_id, tickets);
      if (response === "success") {
        onSuccess("Ticket claimed successfully!");
      }
      return response;
    }
  }, [xEvent]);

  return { getVIPTicket, getBasicTicket, count };
};
