import { api } from "@vx/api";
import { fetchMutation } from "convex/nextjs";

export const incrementViews = async (id: string | undefined) => {
  if (!id) return;
  await fetchMutation(api.events.update.views, { id });
};
export const likeEvent = async (
  id: string | null,
  target_id: string | undefined,
) => {
  if (!id || !target_id) return;
  await fetchMutation(api.users.update.likes, { id, target_id });
};
export const bookmarkEvent = async (
  id: string | null,
  target_id: string | undefined,
) => {
  if (!id || !target_id) return;
  await fetchMutation(api.users.update.bookmarks, { id, target_id });
};
