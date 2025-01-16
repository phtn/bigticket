import { v } from "convex/values";
import { type Id } from "@vx/dataModel";
import { mutation } from "@vx/server";

export const url = mutation({
  args: { storageId: v.string() },
  handler: async ({ storage }, { storageId }) =>
    await storage.getUrl(storageId as Id<"_storage">),
});
