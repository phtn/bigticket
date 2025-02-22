// "use client";

// import { Err } from "@/utils/helpers";
// import type { SelectEvent, UserTicket } from "convex/events/d";
// import {
//   createContext,
//   type Dispatch,
//   type SetStateAction,
//   type TransitionStartFunction,
//   use,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   useTransition,
//   type ReactNode,
// } from "react";
// import { ConvexCtx } from "../convex";
// import { getUserID } from "@/app/actions";
// import { type Preloaded, usePreloadedQuery } from "convex/react";
// import type { api } from "@vx/api";

// interface ImageURL {
//   cover_src: string | null;
//   logo_src?: string;
// }
// export type SignedEvent = SelectEvent & ImageURL;

// interface PreloadedEventsCtxValues {
//   signedEvents: SignedEvent[] | undefined;
//   // pending: boolean;
//   // getEvent: (event_id: string) => void;
//   // counter: UserCounter | null;
//   // is_pending: boolean;
// }

// interface PreloadedEventsCtxProps {
//   children: ReactNode;
//   preloadedEvents: Preloaded<typeof api.events.get.all>;
//   id?: string | undefined;
// }
// export interface UserCounter {
//   bookmarks: string[] | undefined;
//   likes: string[] | undefined;
//   followers: string[] | undefined;
//   following: string[] | undefined;
//   following_count: number | undefined;
//   follower_count: number | undefined;
//   tickets: UserTicket[] | undefined;
// }
// export const PreloadedEventsCtx =
//   createContext<PreloadedEventsCtxValues | null>(null);

// export const PreloadedEventsCtxProvider = ({
//   children,
//   preloadedEvents,
// }: PreloadedEventsCtxProps) => {
//   const events = usePreloadedQuery(preloadedEvents);

//   const [signedEvents, setSignedEvents] = useState<SignedEvent[]>();
//   const [userId, setUserId] = useState<string | null>(null);
//   const [counter, setCounter] = useState<UserCounter | null>(null);
//   const { files, getUserById } = use(ConvexCtx)!;

//   const getUserId = useCallback(async () => await getUserID(), []);
//   useEffect(() => {
//     getUserId().then(setUserId).catch(Err);
//   }, [getUserId]);

//   const user = userId && getUserById(userId);

//   // const userCounter = useCallback(async () => {
//   //   if (!userId || !user) return null;
//   //   const {
//   //     bookmarks,
//   //     likes,
//   //     followers,
//   //     following,
//   //     follower_count,
//   //     following_count,
//   //     tickets,
//   //   } = user;
//   //   return {
//   //     bookmarks,
//   //     likes,
//   //     followers,
//   //     following,
//   //     follower_count,
//   //     following_count,
//   //     tickets,
//   //   };
//   // }, [user, userId]);

//   // const getEvent = useCallback(
//   //   (event_id: string) => {
//   //     const event =
//   //       signedEvents?.find((event) => event.event_id === event_id) ?? null;
//   //     setSelectedEvent(event);
//   //   },
//   //   [signedEvents],
//   // );

//   const collectEvent = useCallback(
//     async (event: SelectEvent) => ({
//       ...event,
//       cover_src: await files.get(event.cover_url),
//     }),
//     [files],
//   );

//   const createSignedEvents = useCallback(async () => {
//     if (!events) return [];
//     const promises = events.map(collectEvent);
//     const resolve = await Promise.all(promises);
//     setSignedEvents(resolve);
//   }, [events, collectEvent]);

//   useEffect(() => {
//     createSignedEvents().catch(Err);
//   }, [createSignedEvents]);

//   const value = useMemo(
//     () => ({
//       signedEvents,
//     }),
//     [signedEvents],
//   );
//   return <PreloadedEventsCtx value={value}>{children}</PreloadedEventsCtx>;
// };
