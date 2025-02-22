// "use client";

// import { getUserID } from "@/app/actions";
// import { useMoment } from "@/hooks/useMoment";
// import { useToggle } from "@/hooks/useToggle";
// import { type IconName } from "@/icons";
// import { Err } from "@/utils/helpers";
// import { type SelectEvent } from "convex/events/d";
// import type {
//   Dispatch,
//   ReactNode,
//   SetStateAction,
//   TransitionStartFunction,
// } from "react";
// import {
//   createContext,
//   use,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   useTransition,
// } from "react";
// import {
//   bookmarkEvent,
//   incrementViews,
//   likeEvent,
// } from "../../account/(tabs)/events/actions";
// import { PreloadedEventsCtx, type SignedEvent } from "./all";
// import { TicketCtxProvider } from "./ticket";
// import { type InfoItem } from "@/app/(search)/@ev/useEventInfo";

// export interface ActionParams {
//   event_id?: string;
//   event_name?: string;
// }

// export interface ActionItem {
//   id: number;
//   label: string;
//   icon: IconName;
//   active: boolean;
//   fn: () => Promise<void>;
// }
// interface EventViewerCtxValues {
//   toggle: VoidFunction;
//   open: boolean;
//   actions: ActionItem[];
//   toggleBookmark: (id: string | undefined) => Promise<void>;
//   toggleLike: (id: string | null, target: string | undefined) => Promise<void>;
//   incrementViews: (id: string | undefined) => Promise<void>;
//   activeEvent: SelectEvent | null;
//   activeEventInfo: InfoItem[];
//   cover_src: string | null;
//   moments: {
//     start_time: { full: string; compact: string };
//     narrow: { day: string; date: string };
//   };
//   user_id: string | null;
// }
// export const EventViewerCtx = createContext<EventViewerCtxValues | null>(null);

// export const EventViewerCtxProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const { open, toggle } = useToggle();
//   const {} = use(PreloadedEventsCtx)!;

//   const [user_id, setUser_id] = useState<string | null>(null);
//   const [activeEvent, setActiveEvent] = useState<SignedEvent | null>(null);

//   // const getEvent = useCallback(
//   //   (event_id: string) => {
//   //     const event =
//   //       signedEvents?.find((event) => event.event_id === event_id) ?? null;
//   //     setActiveEvent(event);
//   //   },
//   //   [signedEvents],
//   // );

//   const { start_time, narrow, event_time, durationHrs, compact } = useMoment({
//     date: activeEvent?.event_date,
//     start: activeEvent?.start_date,
//     end: activeEvent?.end_date,
//   });

//   const moments = useMemo(() => ({ start_time, narrow }), [start_time, narrow]);

//   // const getEventUpdate = useCallback(async () => {
//   //   if (!activeEvent) return null;
//   //   return (await fetchEventById(activeEvent.event_id)) as SelectEvent;
//   // }, [activeEvent]);
//   //
//   useEffect(() => {
//     incrementViews(activeEvent?.event_id).catch(Err);
//   }, []);

//   const actionParams: ActionParams = useMemo(
//     () => ({
//       event_name: activeEvent?.event_name,
//       event_id: activeEvent?.event_id,
//     }),
//     [activeEvent],
//   );
//   const shareData: ShareData = useMemo(
//     () => ({
//       title: activeEvent?.event_name,
//       text: activeEvent?.event_id,
//       url: activeEvent?.event_url,
//     }),
//     [activeEvent],
//   );

//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);

//   const [pending, fn] = useTransition();
//   const setFn = <T,>(
//     tx: TransitionStartFunction,
//     action: () => Promise<T>,
//     set: Dispatch<SetStateAction<T>>,
//   ) => {
//     tx(async () => {
//       set(await action());
//     });
//   };

//   const getId = useCallback(async () => {
//     return await getUserID();
//   }, []);
//   const getUserId = useCallback(() => {
//     setFn(fn, getId, setUser_id);
//   }, [getId]);

//   useEffect(() => {
//     getUserId();
//   }, [getUserId]);

//   // const getActiveEvent = useCallback(() => {
//   //   setFn(fn, getEventUpdate, setActiveEvent);
//   // }, [getEventUpdate]);

//   // useEffect(() => {
//   //   getActiveEvent();
//   //   console.log(bookmarked ? "" : ".", liked ? "" : ".");
//   // }, [getActiveEvent, bookmarked, liked]);
//   //
//   const toggleLike = useCallback(async () => {
//     await likeEvent(user_id, activeEvent?.event_id);
//   }, [activeEvent?.event_id, user_id]);

//   const toggleBookmark = useCallback(async () => {
//     await bookmarkEvent(user_id, activeEvent?.event_id);
//   }, [activeEvent?.event_id, user_id]);

//   // const isLiked = useCallback(async () => {
//   //   if (counter?.likes && activeEvent?.event_id) {
//   //     return counter.likes.includes(activeEvent.event_id);
//   //   }
//   //   return false;
//   // }, [counter?.likes, activeEvent]);

//   // const isLikeActive = useCallback(() => {
//   //   setFn(fn, isLiked, setLiked);
//   // }, [isLiked]);

//   // useEffect(() => {
//   //   isLikeActive();
//   // }, [isLikeActive]);

//   // const isBookmarked = useCallback(async () => {
//   //   if (counter?.bookmarks && activeEvent?.event_id) {
//   //     return counter.bookmarks.includes(activeEvent.event_id);
//   //   }
//   //   return false;
//   // }, [counter?.bookmarks, activeEvent]);

//   // const isBookmarkActive = useCallback(() => {
//   //   setFn(fn, isBookmarked, setBookmarked);
//   // }, [isBookmarked]);

//   // useEffect(() => {
//   //   isBookmarkActive();
//   // }, [isBookmarkActive]);

//   const handleClickSupport = useCallback(async () => {
//     console.log("support");
//   }, []);

//   const handleClickGeo = useCallback(async () => {
//     console.log("geo");
//   }, []);

//   const handleClickWebsite = useCallback(async () => {
//     console.log("website");
//   }, []);

//   // const bookmarkFn = useCallback(async () => {
//   //   const id = await getUserID();
//   //   if (!id || !actionParams.event_id) return;
//   //   setBookmarked((prev) => !prev);
//   //   await usr.update.bookmarks(id, actionParams.event_id);
//   // }, [usr.update, actionParams]);

//   // const likeFn = useCallback(async () => {
//   //   const id = await getUserID();
//   //   if (!id || !actionParams.event_id) return;
//   //   setLiked((prev) => !prev);
//   //   await usr.update.likes(id, actionParams.event_id);
//   // }, [usr.update, actionParams]);

//   const handleClickShare = useCallback(async () => {
//     try {
//       await navigator.share(shareData);
//     } catch (e) {
//       if (e instanceof Error) {
//         console.log(
//           e.name === "AbortError"
//             ? "Share action canceled by user."
//             : e.message,
//         );
//       }
//     }
//   }, [shareData]);

//   const bookmarkItem = useMemo(
//     () => ({
//       id: 3,
//       label: "bookmark",
//       icon: pending
//         ? "SpinnerClock"
//         : bookmarked
//           ? "BookmarkCheck"
//           : ("BookmarkPlus" as IconName),
//       active: bookmarked ?? false,
//       fn: toggleBookmark,
//     }),
//     [bookmarked, toggleBookmark, pending],
//   );

//   const likeItem = useMemo(
//     () => ({
//       id: 4,
//       label: "like",
//       icon: pending
//         ? "SpinnerClock"
//         : liked
//           ? "HeartCheck"
//           : ("Heart" as IconName),
//       active: liked,
//       fn: toggleLike,
//     }),
//     [liked, toggleLike, pending],
//   );

//   const activeEventInfo: InfoItem[] = useMemo(
//     () => [
//       {
//         label: "Ticket Sales",
//         value: activeEvent?.is_private ? "PRIVATE EVENT" : "OPEN",
//       },
//       {
//         label: activeEvent?.is_private ? "Tickets Claimed" : "Tickets Sold",
//         value: activeEvent?.tickets_sold ?? 0,
//       },
//       { label: "Tickets Remaining", value: "50" },
//       { label: "Date", value: compact },
//       { label: "Time", value: event_time.compact },
//       { label: "Duration", value: getDuration(durationHrs) },
//       { label: "Likes", value: activeEvent?.likes ?? 0 },
//       { label: "Views", value: activeEvent?.views ?? 0 },
//       { label: "Bookmarks", value: activeEvent?.bookmarks ?? 0 },
//     ],
//     [
//       activeEvent?.views,
//       activeEvent?.likes,
//       activeEvent?.bookmarks,
//       activeEvent?.is_private,
//       activeEvent?.tickets_sold,
//       event_time,
//       durationHrs,
//       compact,
//     ],
//   );

//   const actions: ActionItem[] = useMemo(
//     () => [
//       {
//         id: 0,
//         label: "support",
//         icon: "Support",
//         active: false,
//         fn: handleClickSupport,
//       },
//       {
//         id: 1,
//         label: "geolocation",
//         icon: "MapPin",
//         active: false,
//         fn: handleClickGeo,
//       },
//       {
//         id: 2,
//         label: "website",
//         icon: "Globe",
//         active: false,
//         fn: handleClickWebsite,
//       },
//       bookmarkItem,
//       likeItem,
//       {
//         id: 5,
//         label: "share",
//         icon: "Share",
//         active: false,
//         fn: handleClickShare,
//       },
//     ],
//     [
//       handleClickSupport,
//       handleClickGeo,
//       handleClickWebsite,
//       handleClickShare,
//       bookmarkItem,
//       likeItem,
//     ],
//   );
//   const cover_src = activeEvent?.cover_src ?? null;

//   const value = useMemo(
//     () => ({
//       open,
//       toggle,
//       actions,
//       toggleLike,
//       toggleBookmark,
//       incrementViews,
//       activeEvent,
//       activeEventInfo,
//       moments,
//       cover_src,
//       user_id,
//     }),
//     [
//       open,
//       toggle,
//       actions,
//       toggleLike,
//       toggleBookmark,
//       incrementViews,
//       activeEvent,
//       activeEventInfo,
//       moments,
//       cover_src,
//       user_id,
//     ],
//   );
//   return (
//     <EventViewerCtx value={value}>
//       <TicketCtxProvider>{children}</TicketCtxProvider>
//     </EventViewerCtx>
//   );
// };

// const getDuration = (duration: number | undefined) => {
//   if (!duration) return "0 hours";
//   return duration % +duration.toFixed(2) === 0
//     ? `${duration} hour${duration > 1 ? "s" : ""}`
//     : `${duration.toFixed(0)} hour${duration > 1 ? "s " : " "} ${+(duration % +duration.toFixed(2)).toFixed(2) * 60}m`;
// };
