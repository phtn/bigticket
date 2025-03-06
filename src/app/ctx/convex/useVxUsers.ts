import { api } from "@vx/api";
import { useMutation } from "convex/react";

export const useVxUsers = () => {
  const mut = {
    create: useMutation(api.users.create.default),
    updatePhotoUrl: useMutation(api.users.update.photo_url),
    updateUserLikes: useMutation(api.users.update.likes),
    updateUserBookmarks: useMutation(api.users.update.bookmarks),
    updateUserFollowers: useMutation(api.users.update.followers),
    updateUserFollowing: useMutation(api.users.update.following),
    updateUserTickets: useMutation(api.users.update.tickets),
    updateStatus: useMutation(api.users.update.status),
  };

  return {
    mut: { ...mut },
  };
};

export type VxUsers = ReturnType<typeof useVxUsers>;
