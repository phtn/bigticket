import { mutation } from "@vx/server";
import { EventSchema } from "./d";
import { guid } from "@/utils/helpers";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@vx/dataModel";

const create = mutation({
  args: EventSchema,
  handler: async ({ db }, data) => {
    const event = await checkEvent(db, data.event_id);
    if (event !== null) {
      await db.patch(event._id, {
        updated_at: Date.now(),
      });
      return null;
    }

    return await db.insert("events", {
      ...data,
      event_id: data.event_id,
      host_id: data.host_id,
      ticket_color: 0,
      event_code: guid(),
      updated_at: Date.now(),
    });
  },
});

export default create;

export const checkEvent = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  id: string,
) =>
  await db
    .query("events")
    .withIndex("by_event_id", (q) => q.eq("event_id", id))
    .first();
