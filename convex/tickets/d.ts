import { type Infer, v } from "convex/values";

export const TicketSchema = v.object({
  ticket_id: v.string(),
  ticket_code: v.string(),
  event_id: v.string(),
  ticket_date: v.optional(v.float64()),
  ticket_time: v.optional(v.string()),
  ticket_url: v.optional(v.string()),
  ticket_phone: v.optional(v.string()),
  owner_id: v.optional(v.string()),
  bearer_id: v.optional(v.string()),
  ticket_email: v.optional(v.string()),
  ticket_type: v.optional(v.string()),
  category: v.optional(v.string()),
  subcategory: v.optional(v.string()),
  status: v.optional(v.string()),
  //DETAILS
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  content: v.optional(v.string()),
  thumbnail: v.optional(v.string()),
  cover_url: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  //TICKETS
  is_redeemed: v.optional(v.boolean()),
  is_revoked: v.optional(v.boolean()),
  is_voided: v.optional(v.boolean()),
  is_invalid: v.optional(v.boolean()),
  is_comp: v.optional(v.boolean()),
  is_paid: v.optional(v.boolean()),
  is_guest: v.optional(v.boolean()),
  is_special: v.optional(v.boolean()),
  amount: v.optional(v.number()),
  estimated_attendees: v.optional(v.number()),
  //INFO
  tags: v.optional(v.array(v.string())),
  host_id: v.optional(v.string()),
  host_name: v.optional(v.string()),
  host_email: v.optional(v.string()),
  support_email: v.optional(v.string()),
  customer_service: v.optional(v.string()),
  is_free: v.optional(v.boolean()),
  is_online: v.optional(v.boolean()),
  is_expired: v.optional(v.boolean()),
  is_soldout: v.optional(v.boolean()),
  updated_at: v.optional(v.float64()),
});

export type InsertTicket = Infer<typeof TicketSchema>;
export type SelectTicket = Infer<typeof TicketSchema>;
