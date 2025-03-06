import { mutation } from "@vx/server";
import { v } from "convex/values";
import {
  BasicInfoSchema,
  CohostSchema,
  EventGallerySchema,
  VIP,
  VIPSchema,
} from "./d";
import { doc } from "convex/utils";

export const status = mutation({
  args: { id: v.string(), is_active: v.boolean() },
  handler: async ({ db }, { id, is_active }) => {
    const event = await doc(db, "events", id);
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
    const event = await doc(db, "events", id);
    if (event === null) {
      return null;
    }

    await db.patch(event._id, { photo_url, updated_at: Date.now() });
    return "success";
  },
});

export const cover_url = mutation({
  args: { id: v.string(), cover_url: v.string() },
  handler: async ({ db }, { id, cover_url }) => {
    const event = await doc(db, "events", id);
    if (event === null) {
      return null;
    }

    await db.patch(event._id, { cover_url, updated_at: Date.now() });
    return "success";
  },
});

export const isCoverLight = mutation({
  args: { id: v.string(), is_cover_light: v.boolean() },
  handler: async ({ db }, { id, is_cover_light }) => {
    const event = await doc(db, "events", id);
    if (event === null) {
      return null;
    }

    await db.patch(event._id, { is_cover_light, updated_at: Date.now() });
    return event._id;
  },
});

export const views = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    const event = await doc(db, "events", id);
    if (event === null) {
      return null;
    }

    const computed = event?.views ? event.views + 1 : 1;
    await db.patch(event._id, { views: computed, updated_at: Date.now() });
    return "success";
  },
});

export const likes = mutation({
  args: { id: v.string(), increment: v.number() },
  handler: async ({ db }, { id, increment }) => {
    const event = await doc(db, "events", id);
    if (event === null || !increment) {
      return null;
    }

    const likes = event?.likes ? event.likes + increment : increment;
    await db.patch(event._id, { likes, updated_at: Date.now() });
    return "success";
  },
});

export const vip = mutation({
  args: { id: v.string(), vip: VIPSchema },
  handler: async ({ db }, { id, vip }) => {
    const event = await doc(db, "events", id);
    if (event === null || !vip) {
      return null;
    }

    if (!event?.vip_list) {
      await db.patch(event._id, { vip_list: [vip], updated_at: Date.now() });
      return "success";
    }

    const vips = event.vip_list.slice();
    const vip_list = updateVIP(vips, vip);

    await db.patch(event._id, { vip_list });
    return "success";
  },
});

function updateVIP(vip_list: VIP[], vip: VIP) {
  const map = new Map();
  vip_list.forEach((c, index) => map.set(c.email, index));

  const existingIndex = map.get(vip.email);
  if (existingIndex !== undefined) {
    vip_list[existingIndex]!.ticket_count = vip.ticket_count;
    vip_list[existingIndex]!.invitation_sent = vip.invitation_sent;
  } else {
    vip_list.push(vip);
  }
  return vip_list.filter((vip) => vip.ticket_count !== 0);
}

export const cohost = mutation({
  args: { id: v.string(), cohost: CohostSchema },
  handler: async ({ db }, { id, cohost }) => {
    const event = await doc(db, "events", id);
    if (event === null || !cohost) {
      return null;
    }

    const cohost_email_list = event.cohost_email_list ?? [cohost.email];
    if (event.cohost_email_list) {
      event.cohost_email_list.push(cohost.email);
    }

    if (!event?.cohost_list) {
      await db.patch(event._id, {
        cohost_list: [cohost],
        cohost_email_list,
        updated_at: Date.now(),
      });
      return "success";
    }

    let cohost_list = event.cohost_list.slice();

    const index = event?.cohost_list.findIndex((v) => v.email === cohost.email);

    if (index !== -1) {
      await db.patch(event._id, { cohost_list });
    } else {
      cohost_list.push(cohost);
      await db.patch(event._id, { cohost_list, cohost_email_list });
    }

    const cohostUser = await db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cohost.email))
      .first();
    if (!cohostUser) {
      return "user not found.";
    }

    const cohosted_events = cohostUser.cohosted_events ?? [];
    if (cohostUser.cohosted_events) {
      cohosted_events.push(cohost);
    }
    await db.patch(cohostUser._id, { cohosted_events });
    return "success";
  },
});

export const mediaGallery = mutation({
  args: { id: v.string(), media: EventGallerySchema },
  handler: async ({ db }, { id, media }) => {
    const event = await doc(db, "events", id);
    if (event === null || !media) {
      return null;
    }

    let gallery = event.gallery ?? [media];
    if (event.gallery) {
      event.gallery.push(media);
    }

    if (!event?.gallery) {
      await db.patch(event._id, {
        gallery,
        updated_at: Date.now(),
      });
      return "success";
    }

    gallery = event.gallery.slice();

    const index = event?.gallery.findIndex((v) => v.src === media.src);

    if (index !== -1) {
      await db.patch(event._id, { gallery });
    } else {
      gallery.push(media);
      await db.patch(event._id, { gallery });
    }
    return "success";
  },
});

export const basicInfo = mutation({
  args: { id: v.string(), basicInfo: BasicInfoSchema },
  handler: async ({ db }, { id, basicInfo }) => {
    const event = await doc(db, "events", id);
    if (event === null || !event) {
      return null;
    }

    const {
      event_name,
      event_desc,
      event_url,
      is_online,
      is_private,
      category,
      subcategory,
      start_date,
      end_date,
      venue_name,
      venue_address,
    } = basicInfo;

    await db.patch(event._id, {
      event_name,
      event_desc,
      event_url,
      is_online,
      is_private,
      category,
      subcategory,
      start_date,
      end_date,
      venue_name,
      venue_address,
      updated_at: Date.now(),
    });

    return "success";
  },
});
