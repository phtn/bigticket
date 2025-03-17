import { type Infer, v } from "convex/values";

export const TransactionSchema = v.object({
  tx_id: v.string(),
  rec_id: v.optional(v.string()),
  ref_no: v.optional(v.string()),
  type: v.optional(v.string()),
  status: v.optional(v.string()),
  payload: v.optional(v.string()),
  updated_at: v.optional(v.float64()),
});

export type InsertTransaction = Infer<typeof TransactionSchema>;
export type SelectTransaction = Infer<typeof TransactionSchema>;
