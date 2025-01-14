import { defineSchema, defineTable } from "convex/server";
import { UserSchema } from "./users/d";
import { ArticleSchema } from "./articles/d";

export default defineSchema({
  users: defineTable(UserSchema)
    .index("by_uid", ["id", "nickname"])
    .index("by_email", ["email"])
    .index("by_account_id", ["account_id"])
    .index("by_role", ["role", "id"]),
  articles: defineTable(ArticleSchema)
    .index("by_article_id", ["article_id"])
    .index("by_article_type", ["article_type"])
    .index("by_article_code", ["article_code"]),
});
