import { mutation } from "@vx/server";
import { v } from "convex/values";
import { checkUser } from "./create";
import { type Metadata } from "./d";

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
