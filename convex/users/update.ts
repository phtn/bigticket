import { mutation } from "@vx/server";
import { UpdateUserSchema } from "./d";
import { checkUser } from "./create";
import { v } from "convex/values";
import { GenericDatabaseWriter } from "convex/server";
import { DataModel } from "@vx/dataModel";
import { checkEvent } from "convex/events/create";

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

    const [likes, increment] = updateArray(user?.likes, target_id);
    await db.patch(user._id, { likes, updated_at: Date.now() });

    const event = await checkEvent(db, target_id);
    if (event === null || !increment) {
      return null;
    }
    await db.patch(event._id, {
      likes: event?.likes ? event?.likes + increment : increment,
    });
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

    const [bookmarks, increment] = updateArray(user?.bookmarks, target_id);
    await db.patch(user._id, {
      bookmarks,
      updated_at: Date.now(),
    });

    const event = await checkEvent(db, target_id);
    if (event === null || !increment) {
      return null;
    }
    await db.patch(event._id, {
      bookmarks: event?.bookmarks ? event?.bookmarks + increment : increment,
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

    const [following, increment] = updateArray(user?.bookmarks, target_id);
    await db.patch(user._id, {
      following,
      updated_at: Date.now(),
    });

    const target_user = await checkUser(db, target_id);
    if (target_user === null || !increment) {
      return null;
    }
    await db.patch(target_user._id, {
      following_count: target_user?.following_count
        ? target_user?.following_count + increment
        : increment,
    });
    return "success";
  },
});

export const followers = mutation({
  args: { id: v.string(), target_id: v.string() },
  handler: async ({ db }, { id, target_id }) => {
    const user = await checkUser(db, id);

    if (user === null || target_id === "") {
      return null;
    }

    const [followers, increment] = updateArray(user?.bookmarks, target_id);
    await db.patch(user._id, {
      followers,
      updated_at: Date.now(),
    });
    const target_user = await checkUser(db, target_id);
    if (target_user === null || !increment) {
      return null;
    }
    await db.patch(target_user._id, {
      follower_count: target_user?.follower_count
        ? target_user?.follower_count + increment
        : increment,
    });
    return "success";
  },
});

function updateArray(
  array: string[] | undefined,
  element: string,
): [string[], number] {
  let increment = 1;
  if (!array) {
    return [[element], increment];
  }
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
    increment = -1;
  } else {
    array.push(element);
  }
  return [array, increment];
}
