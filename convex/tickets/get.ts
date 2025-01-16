import { query, mutation } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => await db.query("tickets").collect(),
});

export const byId = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("tickets")
      .withIndex("by_ticket_id", (q) => q.eq("ticket_id", id))
      .first(),
});

export const byHostId = mutation({
  args: { host_id: v.string() },
  handler: async ({ db }, { host_id }) =>
    await db
      .query("tickets")
      .withIndex("by_host_id", (q) => q.eq("host_id", host_id))
      .collect(),
});

export const byEventId = mutation({
  args: { event_id: v.string() },
  handler: async ({ db }, { event_id }) =>
    await db
      .query("tickets")
      .withIndex("by_event_id", (q) => q.eq("event_id", event_id))
      .first(),
});

export const byCategory = mutation({
  args: { category: v.string() },
  handler: async ({ db }, { category }) =>
    await db
      .query("tickets")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect(),
});

export const bySubCategory = mutation({
  args: { subcategory: v.string() },
  handler: async ({ db }, { subcategory }) =>
    await db
      .query("tickets")
      .withIndex("by_subcategory", (q) => q.eq("subcategory", subcategory))
      .collect(),
});
