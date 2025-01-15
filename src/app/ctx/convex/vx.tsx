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

interface VxCtxValues {
  vx: SelectUser | null;
  pending: boolean;
}
export const VxCtx = createContext<VxCtxValues | null>(null);

export const VxProvider = ({ children }: { children: ReactNode }) => {
  const [vx, setVx] = useState<SelectUser | null>(null);

  const { usr, createvx } = use(ConvexCtx)!;

  const [pending, fn] = useTransition();

  const setFn = <T,>(
    stx: TransitionStartFunction,
    action: () => Promise<T>,
    set: Dispatch<SetStateAction<T>>,
  ) => {
    stx(async () => {
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

  useEffect(() => {
    getVxuser();
  }, [getVxuser]);

  const value = useMemo(
    () => ({
      vx,
      pending,
    }),
    [vx, pending],
  );
  return <VxCtx value={value}>{children}</VxCtx>;
};
