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
}
export const VxCtx = createContext<VxCtxValues | null>(null);

export const VxProvider = ({ children }: { children: ReactNode }) => {
  const [vx, setVx] = useState<SelectUser | null>(null);
  const [photo_url, setPhotoURL] = useState<string | null>(null);
  const [vxEvents, setEvents] = useState<SelectEvent[]>();
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

  const getEvents = useCallback(async () => {
    if (!vx?.account_id) return;
    return await events.get.byHostId(vx.account_id);
  }, [events.get, vx?.account_id]);

  const getAllEvents = useCallback(() => {
    setFn(fn, getEvents, setEvents);
  }, [getEvents]);

  useEffect(() => {
    getVxuser();
    getPhotoURL();
    getAllEvents();
  }, [getVxuser, getAllEvents, getPhotoURL]);

  const value = useMemo(
    () => ({
      vx,
      pending,
      vxEvents,
      photo_url,
    }),
    [vx, pending, vxEvents, photo_url],
  );
  return <VxCtx value={value}>{children}</VxCtx>;
};
