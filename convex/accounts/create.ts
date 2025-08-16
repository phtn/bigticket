import { mutation } from "@vx/server";
import { CreateAccountSchema } from "./d";
import { guid } from "@/utils/helpers";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@vx/dataModel";

const create = mutation({
  args: CreateAccountSchema,
  handler: async ({ db }, data) => {
    const user = await checkAccount(db, data.id);
    if (user !== null) {
      await db.patch(user._id, {
        updated_at: Date.now(),
        last_login: Date.now(),
      });
      return null;
    }

    const {
      id: uid,
      email,
      nickname,
      phone_number,
      photo_url,
      fullname,
      email_verified,
      token_identifier,
      metadata,
    } = data;

    return await db.insert("accounts", {
      uid,
      email,
      metadata,
      score: 0,
      nickname,
      fullname,
      photo_url,
      phone_number,
      email_verified,
      role: ["basic"],
      is_active: true,
      token_identifier,
      account_id: guid(),
      is_verified: false,
      updated_at: Date.now(),
      username: email?.split("@").shift(),
    });
  },
});

export default create;

export const checkAccount = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  id: string,
) =>
  await db
    .query("accounts")
    .withIndex("by_uid", (q) => q.eq("uid", id))
    .first();
