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
}
export const VxCtx = createContext<VxCtxValues | null>(null);

export const VxProvider = ({ children }: { children: ReactNode }) => {
  const [vx, setVx] = useState<SelectUser | null>(null);
  const [vxEvents, setEvents] = useState<SelectEvent[]>();

  const { usr, createvx, events } = use(ConvexCtx)!;

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
    let vxuser = await usr.get.byId(userId);
    if (!vxuser) await createvx();
    vxuser = await usr.get.byId(userId);
    return vxuser;
  }, [usr.get, createvx]);

  const getVxuser = useCallback(() => {
    setFn(fn, getVx, setVx);
  }, [getVx]);

  const getEvents = useCallback(async () => {
    if (!vx?.account_id) return;
    const vxe = await events.get.byHostId(vx.account_id);
    return vxe;
  }, [events.get, vx?.account_id]);

  const getAllEvents = useCallback(() => {
    setFn(fn, getEvents, setEvents);
  }, [getEvents]);

  useEffect(() => {
    getVxuser();
    getAllEvents();
  }, [getVxuser, getAllEvents]);

  const value = useMemo(
    () => ({
      vx,
      pending,
      vxEvents,
    }),
    [vx, pending, vxEvents],
  );
  return <VxCtx value={value}>{children}</VxCtx>;
};
