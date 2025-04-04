import { mutation } from "@vx/server";
import { LogSchema } from "./d";
import { guid } from "@/utils/helpers";

const create = mutation({
  args: LogSchema,
  handler: async ({ db }, data) =>
    await db.insert("logs", {
      ...data,
      log_id: guid(),
      updated_at: Date.now(),
    }),
});

export default create;
