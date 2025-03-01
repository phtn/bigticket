import { defineSchema, defineTable } from "convex/server";
import { UserSchema } from "./users/d";
import { ArticleSchema } from "./articles/d";
import { EventSchema } from "./events/d";
import { TicketSchema } from "./tickets/d";

export default defineSchema({
  users: defineTable(UserSchema)
    .index("by_uid", ["id", "nickname"])
    .index("by_email", ["email"])
    .index("by_account_id", ["account_id"])
    .index("by_role", ["role", "id"])
    .index("by_token_id", ["token_identifier", "id"]),
  events: defineTable(EventSchema)
    .index("by_event_id", ["event_id"])
    .index("by_event_type", ["event_type"])
    .index("by_event_code", ["event_code"])
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategory"])
    .index("by_host_id", ["host_id"])
    .index("by_cohost_email", ["cohost_email_list"]),
  tickets: defineTable(TicketSchema)
    .index("by_ticket_id", ["ticket_id"])
    .index("by_ticket_type", ["ticket_type"])
    .index("by_ticket_code", ["ticket_code"])
    .index("by_event_id", ["event_id"])
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategory"])
    .index("by_host_id", ["host_id"])
    .index("by_owner_id", ["owner_id"])
    .index("by_bearer_id", ["bearer_id"]),
  articles: defineTable(ArticleSchema)
    .index("by_article_id", ["article_id"])
    .index("by_article_type", ["article_type"])
    .index("by_article_code", ["article_code"]),
});
