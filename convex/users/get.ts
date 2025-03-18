import { query } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => await db.query("users").collect(),
});

export const byId = query({
  args: { id: v.string() },
  handler: async ({ db, auth }, { id }) =>
    await db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("id", id))
      .first(),
});

export const byEmail = query({
  args: { email: v.string() },
  handler: async ({ db }, { email }) =>
    await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique(),
});

export const byAccountId = query({
  args: { account_id: v.string() },
  handler: async ({ db }, { account_id }) =>
    await db
      .query("users")
      .withIndex("by_account_id", (q) => q.eq("account_id", account_id))
      .unique(),
});

export const byTokenId = query({
  args: { tokenIdentifier: v.optional(v.string()) },
  handler: async ({ db }, { tokenIdentifier }) =>
    await db
      .query("users")
      .withIndex("by_token_id", (q) =>
        q.eq("token_identifier", tokenIdentifier),
      )
      .unique(),
});

export const byRole = query({
  args: { role: v.array(v.string()) },
  handler: async ({ db }, { role }) =>
    await db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", role))
      .collect(),
});

export const tickets = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    const user = await db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("id", id))
      .unique();

    return user?.tickets;
  },
});
