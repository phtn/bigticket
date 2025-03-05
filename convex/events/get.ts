import { query, mutation } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => (await db.query("events").take(25)).reverse(),
});

export const byId = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    const event = await db
      .query("events")
      .withIndex("by_event_id", (q) => q.eq("event_id", id))
      .first();
    return event ?? null;
  },
});

export const byType = mutation({
  args: { event_type: v.string() },
  handler: async ({ db }, { event_type }) =>
    await db
      .query("events")
      .withIndex("by_event_type", (q) => q.eq("event_type", event_type))
      .first(),
});

export const byHostId = query({
  args: { host_id: v.string() },
  handler: async ({ db }, { host_id }) =>
    await db
      .query("events")
      .withIndex("by_host_id", (q) => q.eq("host_id", host_id))
      .collect(),
});

export const byIds = query({
  args: {
    ids: v.array(v.string()),
  },
  handler: async ({ db }, { ids }) => {
    const events = await Promise.all(
      ids
        .map((id) =>
          db
            .query("events")
            .withIndex("by_event_id", (q) => q.eq("event_id", id))
            .collect(),
        )
        .reverse(),
    );
    return events.flat();
  },
});

export const byCohostEmail = query({
  args: { email: v.array(v.string()) },
  handler: async ({ db }, { email }) =>
    (
      await db
        .query("events")
        .filter((q) => q.eq(q.field("cohost_email_list"), email))
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
