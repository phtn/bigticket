import { mutation } from "@vx/server";
import { v } from "convex/values";
import { checkEvent } from "./create";

export const status = mutation({
  args: { id: v.string(), is_active: v.boolean() },
  handler: async ({ db }, { id, is_active }) => {
    const event = await checkEvent(db, id);
    if (event === null) {
      return null;
    }

    await db.patch(event._id, { is_active, updated_at: Date.now() });
    return event._id;
  },
});

export const photo_url = mutation({
  args: { id: v.string(), photo_url: v.string() },
  handler: async ({ db }, { id, photo_url }) => {
    const event = await checkEvent(db, id);
    if (event === null) {
      return null;
    }

    await db.patch(event._id, { photo_url, updated_at: Date.now() });
    return event._id;
  },
});

export const cover_url = mutation({
  args: { id: v.string(), cover_url: v.string() },
  handler: async ({ db }, { id, cover_url }) => {
    const event = await checkEvent(db, id);
    if (event === null) {
      return null;
    }

    await db.patch(event._id, { cover_url, updated_at: Date.now() });
    return event._id;
  },
});
