import { mutation } from "@vx/server";
import { UpdateUserSchema } from "./d";
import { checkUser } from "./create";
import { v } from "convex/values";
import { checkEvent } from "convex/events/create";
import { UserTicket, UserTicketSchema } from "convex/events/d";

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

export const tickets = mutation({
  args: { id: v.string(), tickets: v.array(UserTicketSchema) },
  handler: async ({ db }, { id, tickets }) => {
    // check user
    const user = await checkUser(db, id);
    if (user === null || tickets.length === 0) {
      console.log("User not found or no tickets provided");
      return null;
    }

    // update user
    const [updated_list, increment] = updateTicketList(
      user.tickets,
      tickets,
      id,
    );
    await db.patch(user._id, {
      ...user,
      tickets: updated_list,
      updated_at: Date.now(),
    });
    const event_id = updated_list?.[0]?.event_id;
    const target_id = tickets?.[0]?.event_id;

    // event
    const target_event = await checkEvent(db, target_id!);
    if (target_event === null || !increment) {
      return null;
    }

    const [updated_event_list, updated] = updateTicketList(
      target_event.tickets,
      tickets,
      id,
    );

    const vip_list = target_event.vip_list ?? [];
    const is_vip = vip_list.findIndex((vip) => vip.email === user.email) !== -1;

    await db.patch(target_event._id, {
      ...target_event,
      vip_list: is_vip ? vip_list.map(vip => ({ ...vip, is_claimed: true })) : vip_list,
      tickets: updated_event_list,
      updated_at: Date.now(),
    });
    return "success";
  },
});

function updateTicketList(
  list: UserTicket[] | undefined,
  tickets: UserTicket[],
  id: string,
): [UserTicket[], boolean] {
  const ticket_url = (event_id: string, ticket_id: string) =>
    "https://bigticket.ph/tickets?x=" +
    id.split("-")[4] +
    "&e=" +
    event_id.split("-")[4] +
    "&t=" +
    ticket_id.split("-").reverse().join("--");

  // default values
  const defaults: Partial<UserTicket> = {
    ticket_class: "premium",
    ticket_status: "active",
    is_active: true,
    is_claimed: false,
    is_expired: false,
    is_used: false,
    user_id: id,
  };

  if (!list) {
    tickets.map((item, i) => ({
      ...defaults,
      ...item,
      ticket_index: i + 1,
      ticket_url: ticket_url(item.event_id, item.ticket_id),
    }));
    return [tickets, true];
  }

  const updatedList = list.map((item) => {
    const matchingTicket = tickets.find((ticket) => ticket.event_id === item.event_id);
    return matchingTicket ? { ...item, ...matchingTicket } : item;
  });

  const newTickets = tickets.filter(
    (ticket) => !list.some((item) => item.event_id === ticket.event_id)
  ).map((item, i) => ({
    ...defaults,
    ...item,
    ticket_url: ticket_url(item.event_id, item.ticket_id),
  }));

  return [updatedList.concat(newTickets), true];
}

export function mapIndexes(items: UserTicket[], ids: string[]): number[] {
  const indexMap = new Map(items.map((item, index) => [item.ticket_id, index]));
  return ids.map((id) => indexMap.get(id) ?? -1);
}

function createIndexMap(array: UserTicket[]) {
  return array.reduce(
    (acc, item, index) => {
      acc[item.ticket_id] = index;
      return acc;
    },
    {} as Record<string, any>,
  );
}
function mapArrayIndexes<T extends UserTicket, U extends UserTicket>(
  sourceArray: T[],
  targetArray: U[],
): number[] {
  const targetIndexMap = createIndexMap(targetArray);

  return sourceArray.map((item) => targetIndexMap[item.ticket_id] ?? -1);
}
