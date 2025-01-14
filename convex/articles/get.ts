import { query, mutation } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => await db.query("articles").collect(),
});

export const byId = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) =>
    await db
      .query("articles")
      .withIndex("by_article_id", (q) => q.eq("article_id", id))
      .first(),
});

export const byType = mutation({
  args: { email: v.string() },
  handler: async ({ db }, { email }) =>
    await db
      .query("articles")
      .withIndex("by_article_type", (q) => q.eq("article_type", email))
      .first(),
});

export const byCode = mutation({
  args: { email: v.string() },
  handler: async ({ db }, { email }) =>
    await db
      .query("articles")
      .withIndex("by_article_code", (q) => q.eq("article_code", email))
      .first(),
});
