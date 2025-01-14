import { type Infer, v } from "convex/values";

const ContentSchema = v.object({
  id: v.string(),
  keyId: v.number(),
  title: v.number(),
  content: v.string(),
});

export const ArticleSchema = v.object({
  article_id: v.string(),
  article_type: v.string(),
  article_code: v.string(),
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  contents: v.optional(v.array(ContentSchema)),
  thumbnail_bg: v.optional(v.string()),
  photo_url: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  views: v.optional(v.number()),
  likes: v.optional(v.number()),
  author_id: v.optional(v.string()),
  author_name: v.optional(v.string()),
  author_email: v.optional(v.string()),
  author_handle: v.optional(v.string()),
});

export type InsertArticle = Infer<typeof ArticleSchema>;
export type SelectArticle = Infer<typeof ArticleSchema>;
export type ArticleContent = Infer<typeof ContentSchema>;
