import { api } from "@vx/api";
import { useMutation } from "convex/react";

export const useVxAccounts = () => {
  const mut = {
    create: useMutation(api.accounts.create.default),
    updatePhotoUrl: useMutation(api.accounts.update.photo_url),
    // updateAccountLikes: useMutation(api.accounts.update.likes),
    // updateAccountBookmarks: useMutation(api.accounts.update.bookmarks),
    // updateAccountFollowers: useMutation(api.accounts.update.followers),
    // updateAccountFollowing: useMutation(api.accounts.update.following),
    // updateAccountTickets: useMutation(api.accounts.update.tickets),
    updateStatus: useMutation(api.accounts.update.status),
  };

  return {
    mut: { ...mut },
  };
};

export type VxAccounts = ReturnType<typeof useVxAccounts>;
