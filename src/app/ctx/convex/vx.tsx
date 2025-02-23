import { setAccountID } from "@/app/actions";
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
import { Err } from "@/utils/helpers";
import { useSession } from "../auth/useSession";
import { useQuery } from "convex/react";
import { api } from "@vx/api";

interface VxCtxValues {
  vx: SelectUser | null;
  pending: boolean;
  photo_url: string | null;
  getVxUser: VoidFunction;
}
export const VxCtx = createContext<VxCtxValues | null>(null);

export const VxProvider = ({ children }: { children: ReactNode }) => {
  const [vx, setVx] = useState<SelectUser | null>(null);
  const [photo_url, setPhotoURL] = useState<string | null>(null);
  const { createvx, files, getUserById } = use(ConvexCtx)!;
  const { user } = useSession()?.userSessionData;

  const userById = useQuery(api.users.get.byId, { id: user?.id ?? "" });
  useEffect(() => {
    if (userById) {
      setVx(userById);
    }
  }, [userById]);

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
    const getUser = (id: string) => getUserById(id);
    if (!user?.id) return null;
    const vxuser = getUser(user.id)
    if (!vxuser) {
      await createvx();
    }
    return vxuser;
  }, [user, createvx, getUserById]);

  const getVxUser = useCallback(() => {
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

  useEffect(() => {
    getVxUser();
    getPhotoURL();
  }, [getVxUser, getPhotoURL]);

  const setAccountId = useCallback(async (account_id: string | undefined) => {
    if (!account_id) return;
    await setAccountID(account_id);
  }, []);

  useEffect(() => {
    if (vx?.account_id) {
      setAccountId(vx.account_id).catch(Err);
    }
  }, [setAccountId, vx?.account_id]);

  const value = useMemo(
    () => ({
      vx,
      pending,
      photo_url,
      getVxUser,
    }),
    [vx, pending, photo_url, getVxUser],
  );
  return <VxCtx value={value}>{children}</VxCtx>;
};
