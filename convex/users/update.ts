import { mutation } from "@vx/server";
import { UpdateUserSchema } from "./d";
import { checkUser } from "./create";
import { v } from "convex/values";

export const info = mutation({
  args: UpdateUserSchema,
  handler: async ({ db }, data) => {
    const user = await checkUser(db, data.id);

    if (user === null) {
      return null;
    }

    if (
      typeof data.is_verified !== "undefined" &&
      user.is_verified !== data.is_verified
    ) {
      await db.patch(user._id, { is_verified: data.is_verified });
    }

    await db.patch(user._id, { updated_at: Date.now() });
    return user._id;
  },
});

export const status = mutation({
  args: { id: v.string(), is_active: v.boolean() },
  handler: async ({ db }, { id, is_active }) => {
    const user = await checkUser(db, id);
    if (user === null) {
      return null;
    }

    await db.patch(user._id, { is_active, updated_at: Date.now() });
    return user._id;
  },
});

export const role = mutation({
  args: { id: v.string(), role: v.string() },
  handler: async ({ db }, { id, role }) => {
    const user = await checkUser(db, id);

    if (user === null || role === "") {
      return null;
    }

    const userRole = user?.role && [...user.role, role];
    await db.patch(user._id, { role: userRole, updated_at: Date.now() });
    return user._id;
  },
});

export const score = mutation({
  args: { id: v.string(), score: v.number() },
  handler: async ({ db }, { id, score }) => {
    const user = await checkUser(db, id);

    if (user === null || !score) {
      return null;
    }

    const computed = user?.score && user.score + score;

    await db.patch(user._id, { score: computed, updated_at: Date.now() });
    return user._id;
  },
});

export const photo_url = mutation({
  args: { id: v.string(), photo_url: v.string() },
  handler: async ({ db }, { id, photo_url }) => {
    const user = await checkUser(db, id);

    if (user === null || !photo_url) {
      return null;
    }

    await db.patch(user._id, { photo_url, updated_at: Date.now() });
    return user._id;
  },
});

export const likes = mutation({
  args: { id: v.string(), target_id: v.string() },
  handler: async ({ db }, { id, target_id }) => {
    const user = await checkUser(db, id);

    if (user === null || target_id === "") {
      return null;
    }

    const likes = updateArray(user?.likes, target_id);
    await db.patch(user._id, { likes, updated_at: Date.now() });
    return "success";
  },
});

export const bookmarks = mutation({
  args: { id: v.string(), target_id: v.string() },
  handler: async ({ db }, { id, target_id }) => {
    const user = await checkUser(db, id);

    if (user === null || target_id === "") {
      return null;
    }

    const bookmarks = updateArray(user?.bookmarks, target_id);
    await db.patch(user._id, {
      bookmarks,
      updated_at: Date.now(),
    });
    return "success";
  },
});

export const following = mutation({
  args: { id: v.string(), target_id: v.string() },
  handler: async ({ db }, { id, target_id }) => {
    const user = await checkUser(db, id);

    if (user === null || target_id === "") {
      return null;
    }

    const following = updateArray(user?.bookmarks, target_id);
    await db.patch(user._id, {
      following,
      updated_at: Date.now(),
    });
    return user._id;
  },
});

export const followers = mutation({
  args: { id: v.string(), target_id: v.string() },
  handler: async ({ db }, { id, target_id }) => {
    const user = await checkUser(db, id);

    if (user === null || target_id === "") {
      return null;
    }

    const followers = updateArray(user?.bookmarks, target_id);
    await db.patch(user._id, {
      followers,
      updated_at: Date.now(),
    });
    return user._id;
  },
});

function updateArray(array: string[] | undefined, element: string): string[] {
  if (!array) {
    return [element];
  }
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(element);
  }
  return array;
}
