import { getUserID } from "@/app/actions";
import type { SelectUser } from "convex/users/d";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type {
  Dispatch,
  ReactNode,
  SetStateAction,
  TransitionStartFunction,
} from "react";
import { ConvexCtx } from ".";
import type { SelectEvent } from "convex/events/d";

interface VxCtxValues {
  vx: SelectUser | null;
  pending: boolean;
  vxEvents: SelectEvent[] | undefined;
  photo_url: string | null;
  allEvents: SelectEvent[] | undefined;
}
export const VxCtx = createContext<VxCtxValues | null>(null);

export const VxProvider = ({ children }: { children: ReactNode }) => {
  const [vx, setVx] = useState<SelectUser | null>(null);
  const [photo_url, setPhotoURL] = useState<string | null>(null);
  const [vxEvents, setEvents] = useState<SelectEvent[]>();
  const [allEvents, setAllEvents] = useState<SelectEvent[]>();
  const { usr, createvx, events, files } = use(ConvexCtx)!;

  const [pending, fn] = useTransition();

  const setFn = <T,>(
    tx: TransitionStartFunction,
    action: () => Promise<T>,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    tx(async () => {
      set(await action());
    });
  };

  const getVx = useCallback(async () => {
    const userId = await getUserID();
    if (!userId) return null;
    const vxuser = await usr.get.byId(userId);
    if (!vxuser) {
      await createvx();
    }
    return await usr.get.byId(userId);
  }, [usr.get, createvx]);

  const getVxuser = useCallback(() => {
    setFn(fn, getVx, setVx);
  }, [getVx]);

  const getPhoto = useCallback(async () => {
    if (!vx?.photo_url) return null;
    const url = vx?.photo_url;
    if (url.startsWith("https")) {
      return url;
    }
    return await files.get(url);
  }, [files, vx?.photo_url]);

  const getPhotoURL = useCallback(() => {
    setFn(fn, getPhoto, setPhotoURL);
  }, [getPhoto]);

  const getEventsByHost = useCallback(async () => {
    if (!vx?.account_id) return;
    return await events.get.byHostId(vx.account_id);
  }, [events.get, vx?.account_id]);

  const getVxEvents = useCallback(() => {
    setFn(fn, getEventsByHost, setEvents);
  }, [getEventsByHost]);

  const getAllEvents = useCallback(async () => {
    return events.get.all();
  }, [events.get]);
  const getEvents = useCallback(() => {
    setFn(fn, getAllEvents, setAllEvents);
  }, [getAllEvents]);

  useEffect(() => {
    getVxuser();
    getPhotoURL();
    getVxEvents();
    getEvents();
  }, [getVxuser, getPhotoURL, getVxEvents, getEvents]);

  const value = useMemo(
    () => ({
      vx,
      pending,
      vxEvents,
      photo_url,
      allEvents,
    }),
    [vx, pending, vxEvents, photo_url, allEvents],
  );
  return <VxCtx value={value}>{children}</VxCtx>;
};
