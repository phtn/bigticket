"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useAccountAuthStore } from "./g-store";
import type { AccountAuthCtxValues } from "./types";
import { deleteCookie } from "@/app/actions";
import { auth } from "@/lib/firebase";

export const AccountAuthContext = createContext<AccountAuthCtxValues | null>(
  null,
);

export const AccountAuthProvider = ({ children }: { children: ReactNode }) => {
  const { updateAccount, isLoading, setLoading, account, setAuthed, isAuthed } =
    useAccountAuthStore();

  useEffect(() => {
    setLoading(true);

    setLoading(isLoading);
  }, [isLoading, updateAccount, setLoading]);

  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      setAuthed(u !== null);
      if (u) {
        updateAccount(u);
      } else {
        updateAccount(null);
      }
    });
  }, [setAuthed, updateAccount]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await deleteCookie("userId");
      await deleteCookie("userEmail");
      await auth.signOut();
      updateAccount(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, updateAccount]);

  const value = useMemo(
    () => ({
      account,
      isLoading,
      updateAccount,
      setLoading,
      logout,
      isAuthed,
    }),
    [account, isLoading, updateAccount, setLoading, logout, isAuthed],
  );

  return (
    <AccountAuthContext.Provider value={value}>
      {children}
    </AccountAuthContext.Provider>
  );
};

export const useAccountAuth = () => {
  const context = useContext(AccountAuthContext);
  if (!context) {
    throw new Error(
      "useAccountAuth must be used within an AccountAuthProvider",
    );
  }
  return context;
};
