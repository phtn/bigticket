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
import { useStorage } from "@/hooks/useStorage";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { q } from "../convex/utils";
import { useAuth } from "../auth/provider";
import { useAuthStore } from "../auth/store";
import toast from "react-hot-toast";

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
  const { item, setItem } = useStorage<{ photoUrl: string | null }>(
    user ? user.id : "xUser",
  );
  const { files, usr } = useConvexCtx();

  const vxUser = useQuery(api.users.get.byId, { id: q(user?.id) });

  const createNewUser = useCallback(
    async (u: CreateUser) => {
      await usr.create(u);
    },
    [usr],
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
  }, [vxUser, isAuthed, user, createUser, createNewUser]);

  const getUserPhoto = useCallback(async () => {
    if (!xUser?.photo_url) return null;

    try {
      // Check if we have a cached photo URL
      const cached = item?.photoUrl;
      if (cached) return cached;

      const url = xUser.photo_url;

      // Handle direct HTTPS urls
      if (url.startsWith("https")) {
        setItem({ photoUrl: url });
        return url;
      }

      // Handle file storage urls
      const imageUrl = await files.get(url);
      if (imageUrl) {
        setItem({ photoUrl: imageUrl });
        return imageUrl;
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [files, xUser?.photo_url, item, setItem]);

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
