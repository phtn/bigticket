import { query, mutation } from "@vx/server";
import { v } from "convex/values";

export const byId = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("transactions")
      .withIndex("by_tx_id", (q) => q.eq("tx_id", id))
      .first(),
});

export const byRefNo = mutation({
  args: { event_id: v.string() },
  handler: async ({ db }, { event_id }) =>
    await db
      .query("transactions")
      .withIndex("by_ref_no", (q) => q.eq("ref_no", event_id))
      .first(),
});
