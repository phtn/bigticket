import { type Infer, v } from "convex/values";

/**
 * Schema for log records
 * @property {string} user_id - Creator identifier
 * @property {string} [log_id] - Unique log identifier
 * @property {string} [event_id] - Optional event identifier
 * @property {string} [type] - Optional event type (e.g., "email", "error")
 * @property {string} [created_by] - Optional creator name
 * @property {number} [updated_at] - Optional timestamp of last update
 */
export const LogSchema = v.object({
  user_id: v.string(),
  log_id: v.optional(v.string()),
  event_id: v.optional(v.string()),
  type: v.optional(v.string()),
  description: v.optional(v.string()),
  created_by: v.optional(v.string()),
  updated_at: v.optional(v.float64()),
});

export type InsertLog = Infer<typeof LogSchema>;
export type SelectLog = Infer<typeof LogSchema>;
