"use client";

import type { CreateAccount, SelectAccount } from "convex/accounts/d";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useConvexCtx } from "../convex";
import { Err } from "@/utils/helpers";
import { useAccountAuth } from "../auth/account-provider";
import { useAccountAuthStore } from "../auth/g-store";
import toast from "react-hot-toast";
import { useConvexUtils } from "../convex/useConvexUtils";
import { useQuery } from "convex/react";
import { api } from "@vx/api";
import { setAccountID } from "@/app/actions";

interface AccountCtxValues {
  xAccount: SelectAccount | undefined;
  photoUrl: string | null;
  isPending: boolean;
}

export const AccountCtx = createContext<AccountCtxValues | null>(null);

export const AccountCtxProvider = ({ children }: { children: ReactNode }) => {
  const { account, isAuthed } = useAccountAuth();
  const { createAccount } = useAccountAuthStore();
  const [isPending, startTransition] = useTransition();
  const [xAccount, setXAccount] = useState<SelectAccount>();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { vxFiles, vxAccounts } = useConvexCtx();
  const { q } = useConvexUtils();

  useEffect(() => {
    if (xAccount) {
      const item = localStorage.getItem(xAccount.uid);
      const pic = item
        ? (JSON.parse(item) as { photoUrl: string } | null)
        : null;
      setPhotoUrl(pic?.photoUrl ?? null);
    }
  }, [xAccount, vxAccounts]);

  const vxAccount = useQuery(api.accounts.get.byId, { id: q(account?.uid) });
  const createNewAccount = useCallback(
    async (u: CreateAccount) => await vxAccounts.mut.create(u),
    [vxAccounts.mut],
  );

  // Update xAccount when vxAccount changes
  useEffect(() => {
    if (account && vxAccount === null) {
      const x = createAccount(account);
      startTransition(async () => {
        await toast.promise(createNewAccount(x), {
          loading: "Creating acct profile...",
          success: "Successfully created!",
          error: "Failed to create acct",
        });
      });
    }
    if (vxAccount && isAuthed) {
      startTransition(() => {
        setXAccount(vxAccount);
      });
    }
  }, [isAuthed, createAccount, createNewAccount, vxAccount, account]);

  useEffect(() => {
    if (vxAccount?.account_id) {
      setAccountID(vxAccount.account_id).catch(Err);
    }
  }, [vxAccount?.account_id]);

  const getAccountPhoto = useCallback(async () => {
    if (!xAccount?.photo_url) return null;

    // Check if we have a cached photo URL
    if (photoUrl) return photoUrl;

    const url = xAccount.photo_url;

    // Handle direct HTTPS urls
    if (url.startsWith("https")) {
      setPhotoUrl(url);
      return url;
    }

    // Handle file storage urls
    const imageUrl = await vxFiles.getUrl(url);
    if (imageUrl) {
      localStorage.setItem(
        xAccount.uid,
        JSON.stringify({ photoUrl: imageUrl }),
      );
      setPhotoUrl(imageUrl);
      return imageUrl;
    }

    return null;
  }, [vxFiles, xAccount?.photo_url, photoUrl, xAccount?.uid]);

  // Update photo URL when acct changes
  useEffect(() => {
    startTransition(() => {
      getAccountPhoto()
        .then((url) => {
          if (url) setPhotoUrl(url);
        })
        .catch(Err);
    });
  }, [getAccountPhoto]);

  const value = useMemo(
    () => ({
      xAccount,
      photoUrl,
      isPending,
    }),
    [xAccount, photoUrl, isPending],
  );

  return <AccountCtx.Provider value={value}>{children}</AccountCtx.Provider>;
};

export const useAccountCtx = () => {
  const context = useContext(AccountCtx);
  if (!context) {
    throw new Error("useAccountCtx must be used within a AccountCtxProvider");
  }
  return context;
};
