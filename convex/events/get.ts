import { query, mutation } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => (await db.query("events").take(25)).reverse(),
});

export const byId = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("events")
      .withIndex("by_event_id", (q) => q.eq("event_id", id))
      .first(),
});

export const byType = mutation({
  args: { event_type: v.string() },
  handler: async ({ db }, { event_type }) =>
    await db
      .query("events")
      .withIndex("by_event_type", (q) => q.eq("event_type", event_type))
      .first(),
});

export const byHostId = mutation({
  args: { host_id: v.string() },
  handler: async ({ db }, { host_id }) =>
    (
      await db
        .query("events")
        .withIndex("by_host_id", (q) => q.eq("host_id", host_id))
        .collect()
    ).reverse(),
});

export const byCode = mutation({
  args: { event_code: v.string() },
  handler: async ({ db }, { event_code }) =>
    await db
      .query("events")
      .withIndex("by_event_code", (q) => q.eq("event_code", event_code))
      .first(),
});

export const byCategory = mutation({
  args: { category: v.string() },
  handler: async ({ db }, { category }) =>
    await db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect(),
});

export const bySubCategory = mutation({
  args: { subcategory: v.string() },
  handler: async ({ db }, { subcategory }) =>
    await db
      .query("events")
      .withIndex("by_subcategory", (q) => q.eq("subcategory", subcategory))
      .collect(),
});
