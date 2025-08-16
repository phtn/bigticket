// import { CohostSchema, AccountTicketSchema } from "@vx/events/d";
import { UserTicketSchema } from "convex/events/d";
import { type Infer, v } from "convex/values";

export const AccountRoleSchema = v.union(
  v.literal("dev"),
  v.literal("admin"),
  v.literal("manager"),
  v.literal("supervisor"),
  v.literal("user"),
);

export type AccountRole = Infer<typeof AccountRoleSchema>;

export const MetadataSchema = v.optional(
  v.array(v.record(v.string(), v.any())),
);
export type Metadata = Infer<typeof MetadataSchema>;

export const AccountMetadataSchema = v.object({
  creationTime: v.optional(v.string()),
  lastLoginTime: v.optional(v.string()),
});
export type AccountMetadata = Infer<typeof AccountMetadataSchema>;

export const AccountGallerySchema = v.object({
  type: v.optional(v.string()),
  src: v.string(),
  index: v.optional(v.number()),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  alt: v.string(),
});
export type AccountGallery = Infer<typeof AccountGallerySchema>;

export const AccountSchema = v.object({
  uid: v.string(),
  account_id: v.optional(v.string()),
  address_id: v.optional(v.string()),
  supervisor_id: v.optional(v.string()),
  email: v.optional(v.string()),
  company_name: v.optional(v.string()),
  company_address_id: v.optional(v.string()),
  company_sector: v.optional(v.string()),
  // cohosted_events: v.optional(v.array(CohostSchema)),
  title: v.optional(v.string()),
  gallery: v.optional(v.array(AccountGallerySchema)),
  private_gallery: v.optional(v.array(AccountGallerySchema)),
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
  email_verified: v.optional(v.boolean()),
  is_verified: v.optional(v.boolean()),
  is_merchant: v.optional(v.boolean()),
  tickets: v.optional(v.array(UserTicketSchema)),
  token_identifier: v.optional(v.string()),
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
  metadata: v.optional(AccountMetadataSchema),
  badges: MetadataSchema,
});

export type SelectAccount = Infer<typeof AccountSchema>;
export type InsertAccount = Infer<typeof AccountSchema>;

export const UpdateAccountSchema = v.object({
  uid: v.string(),
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

export type UpdateAccount = Infer<typeof UpdateAccountSchema>;

export const CreateAccountSchema = v.object({
  id: v.string(),
  email: v.optional(v.string()),
  nickname: v.optional(v.string()),
  fullname: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  token_identifier: v.optional(v.string()),
  email_verified: v.optional(v.boolean()),
  metadata: v.optional(AccountMetadataSchema),
});

export type CreateAccount = Infer<typeof CreateAccountSchema>;
