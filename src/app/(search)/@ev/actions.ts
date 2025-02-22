import { api } from "@vx/api";
import { type UserTicket } from "convex/events/d";
import { fetchMutation } from "convex/nextjs";

export const updateUserTickets = async (id: string, tickets: UserTicket[]) => {
  return await fetchMutation(api.users.update.tickets, {
    id,
    tickets,
  });
};
