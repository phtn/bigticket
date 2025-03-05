import { api } from "@vx/api";
import { useConvexUtils } from "./useConvexUtils";

export const useVxUsers = () => {
  const { useMut } = useConvexUtils();
  const mut = {
    create: useMut(api.users.create.default),
    updatePhotoUrl: useMut(api.users.update.photo_url),
    updateUserLikes: useMut(api.users.update.likes),
    updateUserBookmarks: useMut(api.users.update.bookmarks),
    updateUserFollowers: useMut(api.users.update.followers),
    updateUserFollowing: useMut(api.users.update.following),
    updateUserTickets: useMut(api.users.update.tickets),
    updateStatus: useMut(api.users.update.status),
  };

  return {
    mut: { ...mut },
  };
};

export type VxUsers = ReturnType<typeof useVxUsers>;
