"use client";

import { env } from "@/env";
import { api } from "@vx/api";
import {
  ConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
} from "convex/react";
import type { CreateUser, UpdateUser } from "convex/users/d";
import type { ReactNode } from "react";
import type { ConvexCtxValues } from "./types";
import { createContext, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import type { SupabaseUserMetadata } from "@/app/ctx/auth/types";
import { VxProvider } from "./vx";
import type { InsertEvent, UserTicket } from "convex/events/d";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
export const ConvexCtx = createContext<ConvexCtxValues | null>(null);

const CtxProvider = ({ children, user }: ProviderProps) => {
  const createUser = useMutation(api.users.create.default);
  const getUserById = useMutation(api.users.get.byId);
  const getUserByEmail = useMutation(api.users.get.byEmail);
  const getUserByAccountId = useMutation(api.users.get.byAccountId);
  const getUsersByRole = useMutation(api.users.get.byRole);
  const updateUser = useMutation(api.users.update.info);
  const updateStatus = useMutation(api.users.update.status);
  const updateRole = useMutation(api.users.update.role);
  const updateUserPhotoUrl = useMutation(api.users.update.photo_url);
  const addMetadata = useMutation(api.users.add.metadata);
  const updateUserLikes = useMutation(api.users.update.likes);
  const updateUserBookmarks = useMutation(api.users.update.bookmarks);
  const updateUserFollowers = useMutation(api.users.update.followers);
  const updateUserFollowing = useMutation(api.users.update.following);
  const updateUserTickets = useMutation(api.users.update.tickets);

  const usr = useMemo(
    () => ({
      create: async (args: CreateUser) => await createUser(args),
      get: {
        byId: async (id: string) => await getUserById({ id }),
        byEmail: async (email: string) => await getUserByEmail({ email }),
        byAccountId: async (account_id: string) =>
          await getUserByAccountId({ account_id }),
        byRole: async (role: string[]) => await getUsersByRole({ role }),
      },
      update: {
        info: async (args: UpdateUser) => await updateUser(args),
        status: async (id: string, is_active: boolean) =>
          await updateStatus({ id, is_active }),
        role: async (id: string, role: string) =>
          await updateRole({ id, role }),
        photo_url: async (id: string, photo_url: string) =>
          await updateUserPhotoUrl({ id, photo_url }),
        likes: async (id: string, target_id: string) =>
          await updateUserLikes({ id, target_id }),
        bookmarks: async (id: string, target_id: string) =>
          await updateUserBookmarks({ id, target_id }),
        followers: async (id: string, target_id: string) =>
          await updateUserFollowers({ id, target_id }),
        following: async (id: string, target_id: string) =>
          await updateUserFollowing({ id, target_id }),
        tickets: async (id: string, tickets: UserTicket[]) =>
          await updateUserTickets({ id, tickets }),
      },
      add: {
        metadata: async (
          id: string,
          record: Record<string, string | number | boolean>,
        ) => await addMetadata({ id, record }),
      },
      //
    }),
    [
      addMetadata,
      createUser,
      getUserById,
      updateUser,
      getUserByAccountId,
      getUsersByRole,
      getUserByEmail,
      updateStatus,
      updateRole,
      updateUserPhotoUrl,
      updateUserLikes,
      updateUserBookmarks,
      updateUserFollowers,
      updateUserFollowing,
      updateUserTickets,
    ],
  );

  const generateFileUrl = useMutation(api.files.create.url);
  const getFileUrl = useMutation(api.files.get.url);

  const createUrl = useCallback(
    async (file?: File) => {
      if (!file) return null;
      const postUrl = await generateFileUrl();
      const result = (
        await fetch(postUrl, {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file?.type ?? "image/*",
          },
        })
      ).json() as Promise<{ storageId: string }>;
      return (await result).storageId;
    },
    [generateFileUrl],
  );

  const files = useMemo(
    () => ({
      create: async (file?: File) => await createUrl(file),
      get: async (storageId: string | undefined) =>
        storageId ? await getFileUrl({ storageId }) : null,
    }),
    [createUrl, getFileUrl],
  );

  const createvx = useCallback(async () => {
    if (!user) return null;
    const { name, fullname, avatar_url } =
      user.user_metadata as SupabaseUserMetadata;
    const userdata: CreateUser = {
      id: user.id,
      name: name,
      email: user.email,
      phone: user.phone,
      fullname: fullname,
      avatar_url: avatar_url,
    };
    return await usr.create(userdata);
  }, [user, usr]);

  const createEvent = useMutation(api.events.create.default);
  const getAllEvents = useQuery(api.events.get.all);
  const getEventById = useMutation(api.events.get.byId);
  const getEventsByHostId = useMutation(api.events.get.byHostId);
  const updateEventStatus = useMutation(api.events.update.status);
  const updateCoverUrl = useMutation(api.events.update.cover_url);
  const updatePhotoUrl = useMutation(api.events.update.photo_url);
  const updateEventViews = useMutation(api.events.update.views);

  const events = useMemo(
    () => ({
      create: async (args: InsertEvent) => await createEvent(args),
      get: {
        all: () => getAllEvents,
        byId: async (id: string) => await getEventById({ id }),
        byHostId: async (host_id: string) =>
          await getEventsByHostId({ host_id }),
      },
      update: {
        status: async (id: string, is_active: boolean) =>
          await updateEventStatus({ id, is_active }),
        cover_url: async (id: string, cover_url: string) =>
          await updateCoverUrl({ id, cover_url }),
        photo_url: async (id: string, photo_url: string) =>
          await updatePhotoUrl({ id, photo_url }),
        views: async (id: string) => await updateEventViews({ id }),
      },
    }),
    [
      createEvent,
      getAllEvents,
      getEventById,
      getEventsByHostId,
      updateEventStatus,
      updateCoverUrl,
      updatePhotoUrl,
      updateEventViews,
    ],
  );

  const value = useMemo(
    () => ({
      usr,
      createvx,
      files,
      events,
    }),
    [usr, createvx, files, events],
  );

  return <ConvexCtx value={value}>{children}</ConvexCtx>;
};

interface ProviderProps {
  children: ReactNode;
  user: User | null;
}
const Provider = ({ children, user }: ProviderProps) => {
  return (
    <ConvexProvider client={convex}>
      <CtxProvider user={user}>
        <VxProvider>{children}</VxProvider>
      </CtxProvider>
    </ConvexProvider>
  );
};
export default Provider;

// const createLog = useMutation(api.logs.create.default);
// const getLogById = useMutation(api.logs.get.byId);

// const logs = useMemo(
//   () => ({
//     create: async (args: InsertLog) => await createLog(args),
//     get: {
//       byId: async (id: string) => await getLogById({ id }),
//     },
//   }),
//   [createLog, getLogById],
// );
