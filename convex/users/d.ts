import { CohostSchema, UserTicketSchema } from "convex/events/d";
import { type Infer, v } from "convex/values";

export const UserRoleSchema = v.union(
  v.literal("dev"),
  v.literal("admin"),
  v.literal("manager"),
  v.literal("supervisor"),
  v.literal("user"),
);

export type UserRole = Infer<typeof UserRoleSchema>;

export const MetadataSchema = v.optional(
  v.array(v.record(v.string(), v.any())),
);
export type Metadata = Infer<typeof MetadataSchema>;

export const UserSchema = v.object({
  id: v.string(),
  account_id: v.optional(v.string()),
  address_id: v.optional(v.string()),
  supervisor_id: v.optional(v.string()),
  email: v.optional(v.string()),
  company_name: v.optional(v.string()),
  company_address_id: v.optional(v.string()),
  company_sector: v.optional(v.string()),
  cohosted_events: v.optional(v.array(CohostSchema)),
  title: v.optional(v.string()),
  photo_lib: v.optional(v.array(v.string())),
  photo_modified: v.optional(v.boolean()),
  industry: v.optional(v.string()),
  division: v.optional(v.string()),
  score: v.optional(v.number()),
  firstname: v.optional(v.string()),
  fullname: v.optional(v.string()),
  lastname: v.optional(v.string()),
  nickname: v.optional(v.string()),
  username: v.optional(v.string()),
  is_active: v.optional(v.boolean()),
  is_verified: v.optional(v.boolean()),
  is_merchant: v.optional(v.boolean()),
  tickets: v.optional(v.array(UserTicketSchema)),
  impressions: v.optional(v.number()),
  active_tickets: v.optional(v.number()),
  used_tickets: v.optional(v.number()),
  middlename: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  followers: v.optional(v.array(v.string())),
  following: v.optional(v.array(v.string())),
  follower_count: v.optional(v.number()),
  following_count: v.optional(v.number()),
  likes: v.optional(v.array(v.string())),
  bookmarks: v.optional(v.array(v.string())),
  role: v.optional(v.array(v.string())),
  activation_code: v.optional(v.string()),
  updated_at: v.optional(v.float64()),
  last_login: v.optional(v.float64()),
  metadata: MetadataSchema,
  badges: MetadataSchema,
});

export type SelectUser = Infer<typeof UserSchema>;
export type InsertUser = Infer<typeof UserSchema>;

export const UpdateUserSchema = v.object({
  id: v.string(),
  email: v.optional(v.string()),
  supervisor_id: v.optional(v.string()),
  nickname: v.optional(v.string()),
  firstname: v.optional(v.string()),
  middlename: v.optional(v.string()),
  lastname: v.optional(v.string()),
  fullname: v.optional(v.string()),
  is_active: v.optional(v.boolean()),
  is_verified: v.optional(v.boolean()),
  is_merchant: v.optional(v.boolean()),
  phone_number: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  role: v.optional(v.array(v.string())),
  metadata: MetadataSchema,
  address_id: v.optional(v.string()),
  score: v.optional(v.number()),
});

export type UpdateUser = Infer<typeof UpdateUserSchema>;

export const CreateUserSchema = v.object({
  id: v.string(),
  email: v.optional(v.string()),
  name: v.optional(v.string()),
  fullname: v.optional(v.string()),
  phone: v.optional(v.string()),
  avatar_url: v.optional(v.string()),
});

export type CreateUser = Infer<typeof CreateUserSchema>;
