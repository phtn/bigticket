import { query } from "@vx/server";
import { v } from "convex/values";

export const byId = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("transactions")
      .withIndex("by_txn_id", (q) => q.eq("txn_id", id))
      .first(),
});

export const byRefNo = query({
  args: { ref_no: v.string() },
  handler: async ({ db }, { ref_no }) =>
    await db
      .query("transactions")
      .withIndex("by_ref_no", (q) => q.eq("ref_no", ref_no))
      .first(),
});
