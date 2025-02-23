import { query, mutation } from "@vx/server";
import { v } from "convex/values";

export const all = query({
  handler: async ({ db }) => await db.query("users").collect(),
});

export const byId = query({
  args: { id: v.optional(v.string()) },
  handler: async ({ db, auth }, { id }) => {
    if (!id) return null;
    const tokenIdentity = (await auth.getUserIdentity())?.tokenIdentifier;
    console.log(tokenIdentity);
    if (!tokenIdentity) return null;

    const user = await db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("id", id))
      .first();

    return user ?? null;
  },
});

export const byEmail = mutation({
  args: { email: v.string() },
  handler: async ({ db }, { email }) =>
    await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first(),
});

export const byAccountId = mutation({
  args: { account_id: v.string() },
  handler: async ({ db }, { account_id }) =>
    await db
      .query("users")
      .withIndex("by_account_id", (q) => q.eq("account_id", account_id))
      .first(),
});

export const byRole = mutation({
  args: { role: v.array(v.string()) },
  handler: async ({ db }, { role }) =>
    await db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", role))
      .collect(),
});
