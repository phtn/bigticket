import { mutation } from "@vx/server";
import { v } from "convex/values";
import { checkUser } from "./create";
import { UserTicket, UserTicketSchema, type Metadata } from "./d";

export const metadata = mutation({
  args: { id: v.string(), record: v.record(v.string(), v.any()) },
  handler: async ({ db }, { id, record }) => {
    const user = await checkUser(db, id);
    if (!user) {
      return null;
    }
    const metadata: Metadata = user.metadata
      ? [...user.metadata, record]
      : [record];
    await db.patch(user._id, {
      metadata: metadata,
      updated_at: Date.now(),
    });
  },
});

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
