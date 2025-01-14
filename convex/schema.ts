import { defineSchema, defineTable } from "convex/server";
import { UserSchema } from "./users/d";

export default defineSchema({
  users: defineTable(UserSchema)
    .index("by_uid", ["id", "nickname"])
    .index("by_email", ["email"])
    .index("by_account_id", ["account_id"])
    .index("by_role", ["role", "id"]),
});
