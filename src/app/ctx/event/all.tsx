// "use client";

// import { Err } from "@/utils/helpers";
// import type { SelectEvent } from "convex/events/d";
// import {
//   createContext,
//   use,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";
// import { ConvexCtx } from "../convex";
// import { type XEvent } from "@/app/types";
// import { useQuery } from "convex/react";
// import { api } from "@vx/api";

// interface XEventsCtxValues {
//   xEvents: XEvent[] | undefined;
// }
// interface XEventsCtxProps {
//   children: ReactNode;
// }
// export const XEventsCtx =
//   createContext<XEventsCtxValues | null>(null);

// export const XEventsCtxProvider = ({
//   children,
// }: XEventsCtxProps) => {

//   const { files, usr } = use(ConvexCtx)!;
//   const [allEvents, setEvents] = useState<SelectEvent[]>();
//   const [xEvents, setXEvents] = useState<XEvent[]>();

//   const getAllEvents = () => useQuery(api.events.get.all);

//   // if (!events) {
//   //   useEffect(() => {
//   //     setEvents(getAllEvents());
//   //   }, [usr]);
//   // }

//   const getImageUrl = useCallback(
//     async (event: SelectEvent) => ({
//       ...event,
//       cover_src: await files.get(event.cover_url),
//     }),
//     [files],
//   );

//   const createXEvents = useCallback(async () => {
//     const events = getAllEvents() as SelectEvent[];
//     const promises = events?.map(getImageUrl);
//     return await Promise.all(promises);
//   }, [getImageUrl]);

//   useEffect(() => {
//     createXEvents().then(setXEvents).catch(Err);
//   }, [createXEvents]);

//   const value = useMemo(
//     () => ({
//       xEvents,
//     }),
//     [xEvents],
//   );
//   return <XEventsCtx value={value}>{children}</XEventsCtx>;
// };
