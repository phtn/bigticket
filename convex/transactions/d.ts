import { type Infer, v } from "convex/values";

/**
 * Schema for transaction records
 * @property {string} txn_id - Unique transaction identifier
 * @property {string} [rec_id] - Optional receipt identifier
 * @property {string} [ref_no] - Optional reference number for the transaction
 * @property {string} [type] - Optional transaction type (e.g., "payment", "refund")
 * @property {string} [status] - Optional transaction status (e.g., "pending", "completed")
 * @property {string} [amount] - Optional transaction amount
 * @property {number} [updated_at] - Optional timestamp of last update
 */
export const TransactionSchema = v.object({
  txn_id: v.string(),
  rec_id: v.optional(v.string()),
  ref_no: v.optional(v.string()),
  type: v.optional(v.string()),
  status: v.optional(v.string()),
  amount: v.optional(v.float64()),
  updated_at: v.optional(v.float64()),
});

/** Type for inserting a new transaction record into the database */
export type InsertTransaction = Infer<typeof TransactionSchema>;
/** Type for querying transaction records from the database */
export type SelectTransaction = Infer<typeof TransactionSchema>;
