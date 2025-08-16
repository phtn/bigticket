import { mutation } from "@vx/server";
import { UpdateAccountSchema, AccountGallerySchema } from "./d";
import { checkAccount } from "./create";
import { v } from "convex/values";

export const info = mutation({
  args: UpdateAccountSchema,
  handler: async ({ db }, data) => {
    const user = await checkAccount(db, data.uid);

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
    const user = await checkAccount(db, id);
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
    const user = await checkAccount(db, id);

    if (user === null || role === "") {
      return null;
    }

    const userRole = user?.role && [...user.role, role];
    await db.patch(user._id, { role: userRole, updated_at: Date.now() });
    return user._id;
  },
});

// export const score = mutation({
//   args: { id: v.string(), score: v.number() },
//   handler: async ({ db }, { id, score }) => {
//     const user = await checkAccount(db, id);

//     if (user === null || !score) {
//       return null;
//     }

//     const computed = user?.score && user.score + score;

//     await db.patch(user._id, { score: computed, updated_at: Date.now() });
//     return user._id;
//   },
// });

export const photo_url = mutation({
  args: { id: v.string(), photo_url: v.string() },
  handler: async ({ db }, { id, photo_url }) => {
    const user = await checkAccount(db, id);

    if (user === null || !photo_url) {
      return null;
    }

    await db.patch(user._id, { photo_url, updated_at: Date.now() });
    return "success";
  },
});

// export const likes = mutation({
//   args: { id: v.string(), target_id: v.string() },
//   handler: async ({ db }, { id, target_id }) => {
//     const user = await checkAccount(db, id);

//     if (user === null || target_id === "") {
//       return null;
//     }

//     const [likes, increment] = updateArray(user?.likes, target_id);
//     await db.patch(user._id, { likes, updated_at: Date.now() });

//     const event = await checkEvent(db, target_id);
//     if (event === null || !increment) {
//       return null;
//     }
//     await db.patch(event._id, {
//       likes: event?.likes ? event?.likes + increment : increment,
//     });
//     return "success";
//   },
// });

// export const bookmarks = mutation({
//   args: { id: v.string(), target_id: v.string() },
//   handler: async ({ db }, { id, target_id }) => {
//     const user = await checkAccount(db, id);

//     if (user === null || target_id === "") {
//       return null;
//     }

//     const [bookmarks, increment] = updateArray(user?.bookmarks, target_id);
//     await db.patch(user._id, {
//       bookmarks,
//       updated_at: Date.now(),
//     });

//     const event = await checkEvent(db, target_id);
//     if (event === null || !increment) {
//       return null;
//     }
//     await db.patch(event._id, {
//       bookmarks: event?.bookmarks ? event?.bookmarks + increment : increment,
//     });
//     return "success";
//   },
// });

// export const following = mutation({
//   args: { id: v.string(), target_id: v.string() },
//   handler: async ({ db }, { id, target_id }) => {
//     const user = await checkAccount(db, id);
//     if (user === null || target_id === "") {
//       return null;
//     }

//     const [following, increment] = updateArray(user?.bookmarks, target_id);
//     await db.patch(user._id, {
//       following,
//       updated_at: Date.now(),
//     });

//     const target_user = await checkAccount(db, target_id);
//     if (target_user === null || !increment) {
//       return null;
//     }
//     await db.patch(target_user._id, {
//       following_count: target_user?.following_count
//         ? target_user?.following_count + increment
//         : increment,
//     });
//     return "success";
//   },
// });

// export const followers = mutation({
//   args: { id: v.string(), target_id: v.string() },
//   handler: async ({ db }, { id, target_id }) => {
//     const user = await checkAccount(db, id);

//     if (user === null || target_id === "") {
//       return null;
//     }

//     const [followers, increment] = updateArray(user?.bookmarks, target_id);
//     await db.patch(user._id, {
//       followers,
//       updated_at: Date.now(),
//     });
//     const target_user = await checkAccount(db, target_id);
//     if (target_user === null || !increment) {
//       return null;
//     }
//     await db.patch(target_user._id, {
//       follower_count: target_user?.follower_count
//         ? target_user?.follower_count + increment
//         : increment,
//     });
//     return "success";
//   },
// });

// function updateArray(
//   array: string[] | undefined,
//   element: string,
// ): [string[], number] {
//   let increment = 1;
//   if (!array) {
//     return [[element], increment];
//   }
//   const index = array.indexOf(element);
//   if (index !== -1) {
//     array.splice(index, 1);
//     increment = -1;
//   } else {
//     array.push(element);
//   }
//   return [array, increment];
// }

// export const tickets = mutation({
//   args: { id: v.string(), tickets: v.array(AccountTicketSchema) },
//   handler: async ({ db }, { id, tickets }) => {
//     // check user
//     const user = await checkAccount(db, id);
//     if (user === null || !tickets || tickets.length === 0) {
//       console.log("Account not found or no tickets provided");
//       return null;
//     }

//     const event_id = tickets[0]?.event_id;
//     if (!event_id) return null;

//     // update user tickets
//     const [updated_user_tickets] = updateTicketList(user.tickets, tickets, id);

//     // update user
//     await db.patch(user._id, {
//       ...user,
//       tickets: updated_user_tickets,
//       updated_at: Date.now(),
//     });

//     // check event
//     const target_event = await checkEvent(db, event_id);
//     if (target_event === null) {
//       return null;
//     }
//     // update event tickets
//     const [updated_event_tickets] = updateTicketList(
//       target_event.tickets,
//       tickets,
//       id,
//     );

//     // check if user is a VIP
//     const vipList = target_event.vip_list ?? [];
//     let hasMatch = false;

//     // Map approach that only creates new objects when needed
//     const vip_list = vipList.map((vip) => {
//       if (vip.email === user.email) {
//         hasMatch = true;
//         return { ...vip, tickets_claimed: true };
//       }
//       return vip;
//     });

//     await db.patch(target_event._id, {
//       ...target_event,
//       vip_list,
//       tickets: updated_event_tickets,
//       tickets_issued: updated_event_tickets.length,
//       updated_at: Date.now(),
//     });
//     return "success";
//   },
// });

// function updateTicketList(
//   list: AccountTicket[] | undefined,
//   tickets: AccountTicket[],
//   id: string,
// ): [AccountTicket[], boolean] {
//   const ticket_url = (event_id: string, ticket_id: string) =>
//     "https://bigticket.ph/tickets?x=" +
//     id.split("-").pop() +
//     "&e=" +
//     event_id.split("-").pop() +
//     "&t=" +
//     ticket_id.split("-").reverse().join("--");

//   // default values
//   const defaults: Partial<AccountTicket> = {
//     ticket_class: "premium",
//     ticket_status: "active",
//     ticket_index: 0,
//     is_active: true,
//     is_claimed: true,
//     is_expired: false,
//     is_used: false,
//     user_id: id,
//   };

//   if (!list) {
//     tickets = tickets.map((item, i) => ({
//       ...defaults,
//       ...item,
//       ticket_index: i + 1,
//       ticket_url: ticket_url(item.event_id, item.ticket_id),
//     }));
//     return [tickets, true];
//   }

//   const updatedList = list.map((item) => {
//     const matchingTicket = tickets.find(
//       (ticket) => ticket.ticket_id === item.ticket_id,
//     );
//     return matchingTicket ? { ...item, ...matchingTicket } : item;
//   });

//   const newTickets = tickets
//     .filter(
//       (ticket) => !list.some((item) => item.ticket_id === ticket.ticket_id),
//     )
//     .map((item) => ({
//       ...defaults,
//       ...item,
//       ticket_url: ticket_url(item.event_id, item.ticket_id),
//     }));

//   return [updatedList.concat(newTickets), true];
// }

// export function mapIndexes(items: AccountTicket[], ids: string[]): number[] {
//   const indexMap = new Map(items.map((item, index) => [item.ticket_id, index]));
//   return ids.map((id) => indexMap.get(id) ?? -1);
// }

// export const privateGallery = mutation({
//   args: {
//     id: v.string(),
//     media: AccountGallerySchema,
//   },
//   handler: async ({ db }, { id, media }) => {
//     const user = await checkAccount(db, id);
//     if (!user || !media) {
//       return null;
//     }

//     let private_gallery = user.private_gallery ?? [];
//     if (private_gallery.length === 0) {
//       private_gallery.push(media);
//       await db.patch(user._id, { ...user, private_gallery });
//       return "success";
//     }

//     private_gallery = upsert(user.private_gallery!, media, "src", [
//       "description",
//       "title",
//       "src",
//       "alt",
//       "index",
//     ]);
//     await db.patch(user._id, { ...user, private_gallery });
//     return "success";
//   },
// });
