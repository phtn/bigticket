"use client";

import type { SelectUser } from "convex/users/d";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthCtx } from "../auth";
import { ConvexCtx } from "../convex";
import { Err } from "@/utils/helpers";
import { useStorage } from "@/hooks/useStorage";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { q } from "../convex/utils";

interface UserCtxValues {
  xUser: SelectUser | null;
  photoUrl: string | null;
  pending: boolean;
}
export const UserCtx = createContext<UserCtxValues | null>(null);

export const UserCtxProvider = ({ children }: { children: ReactNode }) => {
  const { user } = use(AuthCtx)!;
  const [xUser, setXUser] = useState<SelectUser | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const { setItem } = useStorage("xUser");

  const { files } = use(ConvexCtx)!;

  const vxUser = useQuery(api.users.get.byId, { id: q(user?.id) });

  useEffect(() => {
    if (vxUser) {
      setXUser(vxUser);
    }
  }, [vxUser]);

  const getUserPhoto = useCallback(async () => {
    setPending(true);
    if (!xUser) {
      setPending(false);
      return null;
    }
    const url = xUser.photo_url;
    if (url?.startsWith("https")) {
      setItem({ photoUrl: url });
      setPending(false);
      return url;
    }

    const imageUrl = await files.get(url);
    setItem({ photoUrl: imageUrl });
    setPending(false);
    return imageUrl;
  }, [files, xUser, setItem]);

  useEffect(() => {
    getUserPhoto().then(setPhotoUrl).catch(Err);
  }, [getUserPhoto]);

  const value = useMemo(
    () => ({
      xUser,
      photoUrl,
      pending,
    }),
    [xUser, photoUrl, pending],
  );
  return <UserCtx value={value}>{children}</UserCtx>;
};
