import { mutation } from "@vx/server";
import { TransactionSchema } from "./d";
import { guid } from "@/utils/helpers";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@vx/dataModel";

const create = mutation({
  args: TransactionSchema,
  handler: async ({ db }, data) => {
    const txn = await checkTx(db, data.txn_id);
    if (txn !== null) {
      await db.patch(txn._id, {
        updated_at: Date.now(),
      });
      return null;
    }

    return await db.insert("transactions", {
      ...data,
      rec_id: guid(),
      updated_at: Date.now(),
    });
  },
});

export default create;

export const checkTx = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  id: string,
) =>
  await db
    .query("transactions")
    .withIndex("by_txn_id", (q) => q.eq("txn_id", id))
    .first();
