import { mutation } from "@vx/server";
import { v } from "convex/values";
import { checkUser } from "./create";
import { type UserTicket, UserTicketSchema } from "../events/d";

export const tickets = mutation({
  args: { id: v.string(), tickets: v.array(UserTicketSchema) },
  handler: async ({ db }, { id, tickets }) => {
    const user = await checkUser(db, id);
    if (!user) {
      return null;
    }
    const userTickets: UserTicket[] = user.tickets
      ? [...user.tickets, ...tickets]
      : tickets;
    await db.patch(user._id, {
      tickets: userTickets,
      updated_at: Date.now(),
    });
  },
});
