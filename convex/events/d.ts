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

export const VIPSchema = v.object({
  email: v.string(),
  name: v.optional(v.string()),
  event_id: v.optional(v.string()),
  event_name: v.optional(v.string()),
  created_by: v.optional(v.union(v.string(), v.null())),
  host_name: v.optional(v.string()),
  updated_at: v.optional(v.float64()),
  ticket_count: v.number(),
  tickets_claimed: v.optional(v.boolean()),
  tickets_used: v.optional(v.number()),
  checked: v.optional(v.boolean()),
  invitation_sent: v.optional(v.boolean()),
  idx: v.optional(v.number()),
});

export type VIP = Infer<typeof VIPSchema>;
export const CohostClearanceSchema = v.object({
  scan_code: v.optional(v.boolean()),
  add_vip: v.optional(v.boolean()),
  view_guest_list: v.optional(v.boolean()),
});
export type CohostClearance = Infer<typeof CohostClearanceSchema>;
export const CohostSchema = v.object({
  email: v.string(),
  name: v.optional(v.string()),
  event_id: v.optional(v.string()),
  event_name: v.optional(v.string()),
  status: v.optional(v.string()),
  created_by: v.optional(v.union(v.string(), v.null())),
  host_name: v.optional(v.string()),
  updated_at: v.optional(v.float64()),
  clearance: v.optional(CohostClearanceSchema),
  checked: v.optional(v.boolean()),
  confirmed: v.optional(v.boolean()),
  idx: v.optional(v.number()),
  invitation_sent: v.optional(v.boolean()),
});
export type Cohost = Infer<typeof CohostSchema>;

export const EventGallerySchema = v.object({
  type: v.optional(v.string()),
  src: v.optional(v.string()),
  index: v.optional(v.number()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  alt: v.optional(v.string()),
});
export type EventGallery = Infer<typeof EventGallerySchema>;

export const UserTicketSchema = v.object({
  event_id: v.string(),
  event_name: v.string(),
  event_url: v.string(),
  event_start: v.float64(),
  event_end: v.float64(),
  event_date: v.float64(),
  user_id: v.optional(v.string()),
  ticket_id: v.string(),
  ticket_type: v.string(),
  ticket_price: v.optional(v.number()),
  ticket_count: v.number(),
  ticket_url: v.optional(v.string()),
  ticket_index: v.optional(v.number()),
  ticket_class: v.optional(v.string()),
  ticket_status: v.optional(v.string()),
  is_active: v.optional(v.boolean()),
  is_claimed: v.optional(v.boolean()),
  is_expired: v.optional(v.boolean()),
  is_used: v.optional(v.boolean()),
  updated_at: v.optional(v.float64()),
});

export type UserTicket = Infer<typeof UserTicketSchema>;

export const BasicInfoSchema = v.object({
  event_name: v.optional(v.string()),
  event_desc: v.optional(v.string()),
  venue_name: v.optional(v.string()),
  venue_address: v.optional(v.string()),
  event_url: v.optional(v.string()),
  event_type: v.optional(v.string()),
  start_date: v.optional(v.float64()),
  end_date: v.optional(v.float64()),
  category: v.optional(v.string()),
  subcategory: v.optional(v.string()),
  is_private: v.boolean(),
  is_online: v.boolean(),
});
export type BasicInfo = Infer<typeof BasicInfoSchema>;

export const TicketInfoSchema = v.object({
  ticket_count: v.optional(v.number()),
  ticket_price: v.optional(v.number()),
  min_age: v.optional(v.number()),
  max_age: v.optional(v.number()),

  ticket_sales_open: v.optional(v.float64()),
  ticket_sales_close: v.optional(v.float64()),
  ticket_sales_limit: v.optional(v.number()),
  ticket_sales_estimate: v.optional(v.number()),

  ticket_sales_email: v.optional(v.string()),
  ticket_sales_phone: v.optional(v.string()),
});

export type TicketInfo = Infer<typeof TicketInfoSchema>;

export const EventSchema = v.object({
  event_id: v.string(),
  event_name: v.optional(v.string()),
  event_desc: v.optional(v.string()),
  venue_name: v.optional(v.string()),
  venue_address: v.optional(v.string()),
  event_url: v.optional(v.string()),
  event_type: v.optional(v.string()),
  start_date: v.optional(v.float64()),
  end_date: v.optional(v.float64()),
  category: v.optional(v.string()),
  subcategory: v.optional(v.string()),
  is_private: v.optional(v.boolean()),
  is_online: v.optional(v.boolean()),
  event_code: v.optional(v.string()),
  event_date: v.optional(v.float64()),
  event_time: v.optional(v.float64()),
  event_geo: v.optional(v.string()),
  event_phone: v.optional(v.string()),
  event_email: v.optional(v.string()),
  event_status: v.optional(v.string()),

  duration: v.optional(v.float64()),
  reviews: v.optional(v.array(ReviewSchema)),
  tickets: v.optional(v.array(UserTicketSchema)),
  tickets_issued: v.optional(v.number()),

  //DETAILS

  status: v.optional(v.string()),
  content: v.optional(v.string()),
  thumbnail: v.optional(v.string()),
  cover_url: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  gallery: v.optional(v.array(EventGallerySchema)),
  is_cover_light: v.optional(v.boolean()),

  //TICKETS
  ticket_count: v.optional(v.number()),
  ticket_price: v.optional(v.number()),
  tickets_sold: v.optional(v.number()),
  min_age: v.optional(v.number()),
  max_age: v.optional(v.number()),

  ticket_sales_open: v.optional(v.float64()),
  ticket_sales_close: v.optional(v.float64()),
  ticket_sales_limit: v.optional(v.number()),
  ticket_sales_estimate: v.optional(v.number()),

  ticket_sales_email: v.optional(v.string()),
  ticket_sales_phone: v.optional(v.string()),

  ticket_value: v.optional(v.number()),
  is_paid: v.optional(v.boolean()),

  tickets_refunded: v.optional(v.number()),
  tickets_voided: v.optional(v.number()),

  total_attendees: v.optional(v.number()),
  // VIP
  vip_list: v.optional(v.array(VIPSchema)),
  // COHOST
  cohost_list: v.optional(v.array(CohostSchema)),
  cohost_email_list: v.optional(v.array(v.string())),
  comp_list: v.optional(v.array(VIPSchema)),
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
  customer_service: v.optional(v.string()),
  is_active: v.optional(v.boolean()),

  is_expired: v.optional(v.boolean()),
  is_soldout: v.optional(v.boolean()),
  social_media: v.optional(SocialMediaSchema),
  metadata: v.optional(v.record(v.string(), v.any())),
  updated_at: v.optional(v.float64()),
});

export type SelectEvent = Infer<typeof EventSchema>;
export type InsertEvent = Infer<typeof EventSchema>;
