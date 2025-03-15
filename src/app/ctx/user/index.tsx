"use client";

import type { CreateUser, SelectUser } from "convex/users/d";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useConvexCtx } from "../convex";
import { Err } from "@/utils/helpers";
import { useAuth } from "../auth/provider";
import { useAuthStore } from "../auth/store";
import toast from "react-hot-toast";
import { useConvexUtils } from "../convex/useConvexUtils";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { setAccountID } from "@/app/actions";

interface UserCtxValues {
  xUser: SelectUser | undefined;
  photoUrl: string | null;
  isPending: boolean;
}

export const UserCtx = createContext<UserCtxValues | null>(null);

export const UserCtxProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthed } = useAuth();
  const { createUser } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [xUser, setXUser] = useState<SelectUser>();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { vxFiles, vxUsers } = useConvexCtx();
  const { q } = useConvexUtils();

  useEffect(() => {
    if (xUser) {
      const item = localStorage.getItem(xUser.id);
      const pic = item
        ? (JSON.parse(item) as { photoUrl: string } | null)
        : null;
      setPhotoUrl(pic?.photoUrl ?? null);
    }
  }, [xUser, vxUsers]);

  const vxUser = useQuery(api.users.get.byId, { id: q(user?.id) });
  const createNewUser = useCallback(
    async (u: CreateUser) => await vxUsers.mut.create(u),
    [vxUsers.mut],
  );

  // Update xUser when vxUser changes
  useEffect(() => {
    if (user && vxUser === null) {
      const x = createUser(user);
      startTransition(async () => {
        await toast.promise(createNewUser(x), {
          loading: "Creating user profile...",
          success: "Successfully created!",
          error: "Failed to create user",
        });
      });
    }
    if (vxUser && isAuthed) {
      startTransition(() => {
        setXUser(vxUser);
      });
    }
  }, [isAuthed, user, createUser, createNewUser, vxUser]);

  useEffect(() => {
    if (vxUser?.account_id) {
      setAccountID(vxUser.account_id).catch(Err);
    }
  }, [vxUser?.account_id]);

  const getUserPhoto = useCallback(async () => {
    if (!xUser?.photo_url) return null;

    // Check if we have a cached photo URL
    if (photoUrl) return photoUrl;

    const url = xUser.photo_url;

    // Handle direct HTTPS urls
    if (url.startsWith("https")) {
      setPhotoUrl(url);
      return url;
    }

    // Handle file storage urls
    const imageUrl = await vxFiles.getUrl(url);
    if (imageUrl) {
      localStorage.setItem(xUser.id, JSON.stringify({ photoUrl: imageUrl }));
      setPhotoUrl(imageUrl);
      return imageUrl;
    }

    return null;
  }, [vxFiles, xUser?.photo_url, photoUrl, xUser?.id]);

  // Update photo URL when user changes
  useEffect(() => {
    startTransition(() => {
      getUserPhoto()
        .then((url) => {
          if (url) setPhotoUrl(url);
        })
        .catch(Err);
    });
  }, [getUserPhoto]);

  const value = useMemo(
    () => ({
      xUser,
      photoUrl,
      isPending,
    }),
    [xUser, photoUrl, isPending],
  );

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
};

export const useUserCtx = () => {
  const context = useContext(UserCtx);
  if (!context) {
    throw new Error("useUserCtx must be used within a UserCtxProvider");
  }
  return context;
};
