"use client";

import { env } from "@/env";
import { api } from "@vx/api";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import type { CreateUser, UpdateUser } from "convex/users/d";
import type { ReactNode } from "react";
import type { ConvexCtxValues } from "./types";
import { createContext, useCallback, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import type { SupabaseUserMetadata } from "@/app/ctx/auth/types";
import { VxProvider } from "./vx";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
export const ConvexCtx = createContext<ConvexCtxValues | null>(null);

const CtxProvider = ({ children, user }: ProviderProps) => {
  const createUser = useMutation(api.users.create.default);
  const getUserById = useMutation(api.users.get.byId);
  const getUserByEmail = useMutation(api.users.get.byEmail);
  const getUserByAccountId = useMutation(api.users.get.byAccountId);
  const getUsersByRole = useMutation(api.users.get.byRole);
  const updateUser = useMutation(api.users.update.info);
  const updateStatus = useMutation(api.users.update.status);
  const updateRole = useMutation(api.users.update.role);
  const addMetadata = useMutation(api.users.add.metadata);

  const usr = useMemo(
    () => ({
      create: async (args: CreateUser) => await createUser(args),
      get: {
        byId: async (id: string) => await getUserById({ id }),
        byEmail: async (email: string) => await getUserByEmail({ email }),
        byAccountId: async (account_id: string) =>
          await getUserByAccountId({ account_id }),
        byRole: async (role: string[]) => await getUsersByRole({ role }),
      },
      update: {
        info: async (args: UpdateUser) => await updateUser(args),
        status: async (id: string, is_active: boolean) =>
          await updateStatus({ id, is_active }),
        role: async (id: string, role: string) =>
          await updateRole({ id, role }),
      },
      add: {
        metadata: async (
          id: string,
          record: Record<string, string | number | boolean>,
        ) => await addMetadata({ id, record }),
      },
      //
    }),
    [
      addMetadata,
      createUser,
      getUserById,
      updateUser,
      getUserByAccountId,
      getUsersByRole,
      getUserByEmail,
      updateStatus,
      updateRole,
    ],
  );

  // const createLog = useMutation(api.logs.create.default);
  // const getLogById = useMutation(api.logs.get.byId);

  // const logs = useMemo(
  //   () => ({
  //     create: async (args: InsertLog) => await createLog(args),
  //     get: {
  //       byId: async (id: string) => await getLogById({ id }),
  //     },
  //   }),
  //   [createLog, getLogById],
  // );

  const generateFileUrl = useMutation(api.files.create.url);
  const getFileUrl = useMutation(api.files.get.url);

  const createUrl = useCallback(
    async (file?: File) => {
      if (!file) return null;
      const postUrl = await generateFileUrl();
      const result = (
        await fetch(postUrl, {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file?.type ?? "image/*",
          },
        })
      ).json() as Promise<{ storageId: string }>;
      return (await result).storageId;
    },
    [generateFileUrl],
  );

  const files = useMemo(
    () => ({
      create: async (file?: File) => await createUrl(file),
      get: async (storageId: string) => await getFileUrl({ storageId }),
    }),
    [createUrl, getFileUrl],
  );

  const createvx = useCallback(async () => {
    if (!user) return null;
    const { name, fullname, avatar_url } =
      user.user_metadata as SupabaseUserMetadata;
    const userdata: CreateUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: name,
      fullname: fullname,
      avatar_url: avatar_url,
    };
    return await usr.create(userdata);
  }, [user, usr]);

  const value = useMemo(
    () => ({
      usr,
      createvx,
      files,
    }),
    [usr, createvx, files],
  );

  return <ConvexCtx value={value}>{children}</ConvexCtx>;
};

interface ProviderProps {
  children: ReactNode;
  user: User | null;
}
const Provider = ({ children, user }: ProviderProps) => {
  return (
    <ConvexProvider client={convex}>
      <CtxProvider user={user}>
        <VxProvider>{children}</VxProvider>
      </CtxProvider>
    </ConvexProvider>
  );
};
export default Provider;
