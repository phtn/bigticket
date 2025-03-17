import { defineSchema, defineTable } from "convex/server";
import { UserSchema } from "./users/d";
import { EventSchema } from "./events/d";
import { TransactionSchema } from "./transactions/d";

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
  transactions: defineTable(TransactionSchema)
    .index("by_status", ["status"])
    .index("by_ref_no", ["ref_no"])
    .index("by_tx_id", ["tx_id"]),
});
