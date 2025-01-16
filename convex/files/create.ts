import { mutation } from "@vx/server";

export const url = mutation(
  async ({ storage }) => await storage.generateUploadUrl(),
);
