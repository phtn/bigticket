import { query } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => await db.query("accounts").collect(),
});

export const byId = query({
  args: { id: v.string() },
  handler: async ({ db, auth }, { id }) =>
    await db
      .query("accounts")
      .withIndex("by_uid", (q) => q.eq("uid", id))
      .first(),
});

export const byEmail = query({
  args: { email: v.string() },
  handler: async ({ db }, { email }) =>
    await db
      .query("accounts")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique(),
});

export const byAccountId = query({
  args: { account_id: v.string() },
  handler: async ({ db }, { account_id }) =>
    await db
      .query("accounts")
      .withIndex("by_account_id", (q) => q.eq("account_id", account_id))
      .unique(),
});
