import { type Infer, v, VObject } from "convex/values";

const excludeProp = <T extends object>(o: T, ...keys: string[]) => {
  const ex = new Set(keys);
  return Object.fromEntries(Object.entries(o).filter(([k]) => !ex.has(k)));
};

const SocialMediaSchema = v.object({
  name: v.string(),
  url: v.string(),
  icon: v.string(),
});

export const EventSchema = v.object({
  event_id: v.string(),
  event_code: v.optional(v.string()),
  event_date: v.optional(v.float64()),
  event_time: v.optional(v.float64()),
  event_url: v.optional(v.string()),
  event_phone: v.optional(v.string()),
  event_email: v.optional(v.string()),
  event_type: v.optional(v.string()),
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
  ticket_count: v.optional(v.number()),
  ticket_value: v.optional(v.number()),
  tickets_sold: v.optional(v.number()),
  tickets_refunded: v.optional(v.number()),
  tickets_voided: v.optional(v.number()),
  total_attendees: v.optional(v.number()),
  estimated_attendees: v.optional(v.number()),
  guest_list: v.optional(v.array(v.number())),
  comp_count: v.optional(v.number()),
  //INFO
  address_id: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  views: v.optional(v.number()),
  likes: v.optional(v.number()),
  host_id: v.optional(v.string()),
  host_name: v.optional(v.string()),
  host_email: v.optional(v.string()),
  support_email: v.optional(v.string()),
  customer_service: v.optional(v.string()),
  is_free: v.optional(v.string()),
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
) as VObject<SelectEvent, {}>;
export type InsertEvent = Infer<typeof InsertEventSchema>;
