import { mutation } from "@vx/server";
import { CreateUserSchema } from "./d";
import { guid } from "@/utils/helpers";
import { type GenericDatabaseWriter } from "convex/server";
import { type DataModel } from "@vx/dataModel";

const create = mutation({
  args: CreateUserSchema,
  handler: async ({ db }, data) => {
    const user = await checkUser(db, data.id);
    if (user !== null) {
      await db.patch(user._id, {
        updated_at: Date.now(),
        last_login: Date.now(),
      });
      return null;
    }

    return await db.insert("users", {
      id: data.id,
      nickname: data.name,
      photo_url: data.avatar_url,
      fullname: data.fullname,
      phone_number: data.phone,
      email: data.email,
      account_id: guid(),
      updated_at: Date.now(),
      is_verified: false,
      is_active: true,
      role: ["basic"],
      score: 0,
    });
  },
});

export default create;

export const checkUser = async <DB extends GenericDatabaseWriter<DataModel>>(
  db: DB,
  id: string,
) =>
  await db
    .query("users")
    .withIndex("by_uid", (q) => q.eq("id", id))
    .first();
