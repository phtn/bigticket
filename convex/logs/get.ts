import { query } from "@vx/server";
import { v } from "convex/values";

export const byId = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("logs")
      .withIndex("by_log_id", (q) => q.eq("log_id", id))
      .first(),
});

export const byUserId = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("logs")
      .withIndex("by_user_id", (q) => q.eq("user_id", id))
      .first(),
});

export const byType = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("logs")
      .withIndex("by_log_type", (q) => q.eq("type", id))
      .first(),
});
