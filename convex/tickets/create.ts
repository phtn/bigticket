import { mutation } from "@vx/server";
import { TicketSchema } from "./d";
import { guid } from "@/utils/helpers";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@vx/dataModel";

const create = mutation({
  args: TicketSchema,
  handler: async ({ db }, data) => {
    const ticket = await checkTicket(db, data.ticket_id);
    if (ticket !== null) {
      await db.patch(ticket._id, {
        updated_at: Date.now(),
      });
      return null;
    }

    return await db.insert("tickets", {
      ...data,
      ticket_id: data.ticket_id,
      host_id: data.ticket_id,
      owner_id: data.host_id,
      ticket_code: guid(),
      updated_at: Date.now(),
    });
  },
});

export default create;

export const checkTicket = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  id: string,
) =>
  await db
    .query("tickets")
    .withIndex("by_ticket_id", (q) => q.eq("ticket_id", id))
    .first();
