import { mutation } from "@vx/server";
import { TransactionSchema } from "./d";
import { guid } from "@/utils/helpers";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@vx/dataModel";

const create = mutation({
  args: TransactionSchema,
  handler: async ({ db }, data) => {
    const tx = await checkTx(db, data.tx_id);
    if (tx !== null) {
      await db.patch(tx._id, {
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
    .withIndex("by_tx_id", (q) => q.eq("tx_id", id))
    .first();
