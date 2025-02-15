import { GenericValidator, type Infer, v, VObject } from "convex/values";

const excludeProp = <T extends object>(o: T, ...keys: string[]) => {
  const ex = new Set(keys);
  return Object.fromEntries(Object.entries(o).filter(([k]) => !ex.has(k)));
};

const SocialMediaSchema = v.object({
  name: v.string(),
  url: v.string(),
  icon: v.string(),
});

const ReviewSchema = v.object({
  title: v.string(),
  content: v.optional(v.string()),
  score: v.float64(),
  author_id: v.string(),
  author_name: v.string(),
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
  likes: v.number(),
  is_verified: v.boolean(),
});
export type Review = Infer<typeof ReviewSchema>;

export const UserTicketSchema = v.object({
  event_id: v.string(),
  event_name: v.string(),
  event_url: v.string(),
  event_start: v.float64(),
  event_end: v.float64(),
  event_date: v.float64(),
  ticket_id: v.string(),
  ticket_type: v.string(),
  ticket_value: v.number(),
  ticket_url: v.optional(v.string()),
  ticket_index: v.optional(v.string()),
  ticket_class: v.optional(v.string()),
  ticket_status: v.optional(v.string()),
  is_active: v.optional(v.boolean()),
  is_claimed: v.optional(v.boolean()),
  is_expired: v.optional(v.boolean()),
  is_used: v.optional(v.boolean()),
  updated_at: v.optional(v.float64()),
});

export type UserTicket = Infer<typeof UserTicketSchema>;

export const EventSchema = v.object({
  event_id: v.string(),

  event_name: v.optional(v.string()),
  event_desc: v.optional(v.string()),

  event_code: v.optional(v.string()),
  event_date: v.optional(v.float64()),
  event_time: v.optional(v.float64()),
  event_geo: v.optional(v.string()),
  event_url: v.optional(v.string()),
  event_phone: v.optional(v.string()),
  event_email: v.optional(v.string()),
  event_type: v.optional(v.string()),
  start_date: v.optional(v.float64()),
  end_date: v.optional(v.float64()),
  duration: v.optional(v.float64()),
  reviews: v.optional(v.array(ReviewSchema)),
  tickets: v.optional(v.array(UserTicketSchema)),

  //DETAILS
  category: v.optional(v.string()),
  subcategory: v.optional(v.string()),
  status: v.optional(v.string()),
  content: v.optional(v.string()),
  thumbnail: v.optional(v.string()),
  cover_url: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  //TICKETS
  ticket_count: v.optional(v.number()),
  ticket_count_limit: v.optional(v.number()),
  ticket_value: v.optional(v.number()),
  tickets_sold: v.optional(v.number()),
  tickets_refunded: v.optional(v.number()),
  tickets_voided: v.optional(v.number()),
  total_attendees: v.optional(v.number()),
  estimated_attendees: v.optional(v.number()),
  vip_list: v.optional(v.array(v.number())),
  comp_count: v.optional(v.number()),
  //INFO
  address_id: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  views: v.optional(v.number()),
  likes: v.optional(v.number()),
  bookmarks: v.optional(v.number()),
  host_id: v.optional(v.string()),
  invite_list: v.optional(v.array(v.string())),
  host_name: v.optional(v.string()),
  host_email: v.optional(v.string()),
  support_email: v.optional(v.string()),
  customer_service: v.optional(v.string()),
  build_progress: v.optional(v.number()),
  audience: v.optional(v.string()),
  is_active: v.optional(v.boolean()),
  is_free: v.optional(v.boolean()),
  is_private: v.optional(v.boolean()),
  is_online: v.optional(v.boolean()),
  is_expired: v.optional(v.boolean()),
  is_soldout: v.optional(v.boolean()),
  social_media: v.optional(SocialMediaSchema),
  metadata: v.optional(v.record(v.string(), v.any())),
  updated_at: v.optional(v.float64()),
});

export type SelectEvent = Infer<typeof EventSchema>;
const InsertEventSchema = excludeProp(
  EventSchema,
  "updated_at",
  "host_id",
  "event_code",
) as VObject<SelectEvent, Record<string, GenericValidator>>;
export type InsertEvent = Infer<typeof InsertEventSchema>;
