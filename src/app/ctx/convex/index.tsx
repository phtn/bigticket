"use client";

import { env } from "@/env";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useVxFiles, type VxFiles } from "./useVxFiles";
import { useVxEvents, type VxEvents } from "./useVxEvents";
import { useVxUsers, type VxUsers } from "./useVxUsers";

interface ConvexProviderProps {
  children: ReactNode;
}

interface ConvexCtxValues {
  vxFiles: VxFiles;
  vxEvents: VxEvents;
  vxUsers: VxUsers;
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
export const ConvexCtx = createContext<ConvexCtxValues | null>(null);

const CtxProvider = ({ children }: ConvexProviderProps) => {
  // const createUser = useMutation(api.users.create.default);
  // const getUserByEmail = useMutation(api.users.get.byEmail);
  // const getUserByAccountId = useMutation(api.users.get.byAccountId);
  // const getUsersByRole = useMutation(api.users.get.byRole);
  // const updateUser = useMutation(api.users.update.info);
  // const updateStatus = useMutation(api.users.update.status);
  // const updateRole = useMutation(api.users.update.role);
  // const updateUserPhoto = useMutation(api.users.update.photo_url);
  // const updateUserLikes = useMutation(api.users.update.likes);
  // const updateUserBookmarks = useMutation(api.users.update.bookmarks);
  // const updateUserFollowers = useMutation(api.users.update.followers);
  // const updateUserFollowing = useMutation(api.users.update.following);
  // const updateUserTickets = useMutation(api.users.update.tickets);

  // const usr = useMemo(
  //   () => ({
  //     create: async (args: CreateUser) => await createUser(args),
  //     get: {
  //       byEmail: async (email: string) => await getUserByEmail({ email }),
  //       byAccountId: async (account_id: string) =>
  //         await getUserByAccountId({ account_id }),
  //       byRole: async (role: string[]) => await getUsersByRole({ role }),
  //     },
  //     update: {
  //       info: async (args: UpdateUser) => await updateUser(args),
  //       status: async (id: string, is_active: boolean) =>
  //         await updateStatus({ id, is_active }),
  //       role: async (id: string, role: string) =>
  //         await updateRole({ id, role }),
  //       photo_url: async (id: string, photo_url: string) =>
  //         await updateUserPhotoUrl({ id, photo_url }),
  //       likes: async (id: string, target_id: string) =>
  //         await updateUserLikes({ id, target_id }),
  //       bookmarks: async (id: string, target_id: string) =>
  //         await updateUserBookmarks({ id, target_id }),
  //       followers: async (id: string, target_id: string) =>
  //         await updateUserFollowers({ id, target_id }),
  //       following: async (id: string, target_id: string) =>
  //         await updateUserFollowing({ id, target_id }),
  //       tickets: async (id: string, tickets: UserTicket[]) =>
  //         await updateUserTickets({ id, tickets }),
  //     },
  //   }),
  //   [
  //     createUser,
  //     updateUser,
  //     getUserByAccountId,
  //     getUsersByRole,
  //     getUserByEmail,
  //     updateStatus,
  //     updateRole,
  //     updateUserPhotoUrl,
  //     updateUserLikes,
  //     updateUserBookmarks,
  //     updateUserFollowers,
  //     updateUserFollowing,
  //     updateUserTickets,
  //   ],
  // );

  // const generateFileUrl = useMutation(api.files.create.url);
  // const getFileUrl = useMutation(api.files.get.url);

  // const createUrl = useCallback(
  //   async (file?: File) => {
  //     if (!file) return null;
  //     const postUrl = await generateFileUrl();
  //     const result = (
  //       await fetch(postUrl, {
  //         method: "POST",
  //         body: file,
  //         headers: {
  //           "Content-Type": file?.type ?? "image/*",
  //         },
  //       })
  //     ).json() as Promise<{ storageId: string }>;
  //     return (await result).storageId;
  //   },
  //   [generateFileUrl],
  // );

  // const files = useMemo(
  //   () => ({
  //     create: async (file?: File) => await createUrl(file),
  //     get: async (storageId: string | undefined) =>
  //       storageId ? await getFileUrl({ storageId }) : null,
  //   }),
  //   [createUrl, getFileUrl],
  // );

  // const createvx = useCallback(async () => {
  //   if (!user) return null;
  //   const { name, fullname, avatar_url } =
  //     user.user_metadata as SupabaseUserMetadata;
  //   const userdata: CreateUser = {
  //     id: user.id,
  //     name: name,
  //     email: user.email,
  //     phone: user.phone,
  //     fullname: fullname,
  //     avatar_url: avatar_url,
  //   };
  //   return await usr.create(userdata);
  // }, [user, usr]);

  // const createEvent = useMutation(api.events.create.default);
  // const updateEventStatus = useMutation(api.events.update.status);
  // const updateCoverUrl = useMutation(api.events.update.cover_url);
  // const updatePhotoUrl = useMutation(api.events.update.photo_url);
  // const updateEventIsCoverLight = useMutation(api.events.update.isCoverLight);
  // const updateEventViews = useMutation(api.events.update.views);
  // const updateEventVIP = useMutation(api.events.update.vip);
  // const updateEventCohost = useMutation(api.events.update.cohost);
  // const updateEventGallery = useMutation(api.events.update.mediaGallery);

  // const events = useMemo(
  //   () => ({
  //     create: async (args: InsertEvent) => await createEvent(args),

  //     update: {
  //       status: async (id: string, is_active: boolean) =>
  //         await updateEventStatus({ id, is_active }),
  //       cover_url: async (id: string, cover_url: string) =>
  //         await updateCoverUrl({ id, cover_url }),
  //       photo_url: async (id: string, photo_url: string) =>
  //         await updatePhotoUrl({ id, photo_url }),
  //       isCoverLight: async (id: string, is_cover_light: boolean) =>
  //         await updateEventIsCoverLight({ id, is_cover_light }),
  //       views: async (id: string) => await updateEventViews({ id }),
  //       vip: async (id: string, vip: VIP) => await updateEventVIP({ id, vip }),
  //       coHost: async (id: string, cohost: Cohost) =>
  //         await updateEventCohost({ id, cohost }),
  //       mediaGallery: async (id: string, media: EventGallery) =>
  //         await updateEventGallery({ id, media }),
  //     },
  //   }),
  //   [
  //     createEvent,
  //     updateEventStatus,
  //     updateCoverUrl,
  //     updatePhotoUrl,
  //     updateEventViews,
  //     updateEventVIP,
  //     updateEventCohost,
  //     updateEventIsCoverLight,
  //     updateEventGallery,
  //   ],
  // );

  // const getAllEvents = useEventAll;
  // const getEventById = useEventById;
  // const getEventsByIds = useEventsByIds;
  // const getEventsByHostId = useEventsByHostId;

  // const value = useMemo(
  //   () => ({
  //     usr,
  //     files,
  //     events,
  //     getAllEvents,
  //     getEventById,
  //     getEventsByIds,
  //     getEventsByHostId,
  //   }),
  //   [
  //     usr,
  //     files,
  //     events,
  //     getAllEvents,
  //     getEventById,
  //     getEventsByIds,
  //     getEventsByHostId,
  //   ],
  // );
  //
  const vxUsers = useVxUsers();
  const vxFiles = useVxFiles();
  const vxEvents = useVxEvents();
  const value = {
    vxUsers,
    vxFiles,
    vxEvents,
  };

  return <ConvexCtx value={value}>{children}</ConvexCtx>;
};

const Provider = ({ children }: ConvexProviderProps) => {
  return (
    <ConvexProvider client={convex}>
      <CtxProvider>{children}</CtxProvider>
    </ConvexProvider>
  );
};

export default Provider;

export const useConvexCtx = () => {
  const context = useContext(ConvexCtx);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
