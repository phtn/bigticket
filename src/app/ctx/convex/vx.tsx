import { setAccountID } from "@/app/actions";
import type { SelectUser } from "convex/users/d";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ConvexCtx } from ".";
import { Err } from "@/utils/helpers";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { q } from "./utils";
import { AuthCtx } from "../auth";

interface VxCtxValues {
  vx: SelectUser | null;
  pending: boolean;
  photo_url: string | null;
}
export const VxCtx = createContext<VxCtxValues | null>(null);

export const VxProvider = ({ children }: { children: ReactNode }) => {
  const { user } = use(AuthCtx)!;
  const [vx, setVx] = useState<SelectUser | null>(null);
  const [photo_url, setPhotoURL] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const { createvx, files } = use(ConvexCtx)!;

  const vxUser = useQuery(api.users.get.byId, { id: q(user?.id) });
  useEffect(() => {
    setPending(true);
    if (user) {
      if (vxUser) {
        setVx(vxUser);
        setPending(false);
      } else {
        createvx().catch(Err);
        setPending(false);
      }

      setPending(false);
    }
  }, [vxUser, user, createvx]);

  const getPhotoURL = useCallback(async () => {
    if (!vx?.photo_url) return null;
    const url = vx?.photo_url;
    if (url.startsWith("https")) {
      return url;
    }
    return await files.get(url);
  }, [files, vx?.photo_url]);

  useEffect(() => {
    getPhotoURL().then(setPhotoURL).catch(Err);
  }, [getPhotoURL]);

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
    }),
    [vx, pending, photo_url],
  );
  return <VxCtx value={value}>{children}</VxCtx>;
};
