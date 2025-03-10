"use server";

import { env } from "@/env";
import { api } from "@vx/api";
import { fetchQuery, preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";

export type Modes = "light" | "dark" | "system";
export interface ModeCookie {
  name: string;
  value: Modes;
  path: string;
}

const defaultOpts = {
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax" as const,
};

export const setTheme = async (theme: Modes) => {
  const cookieStore = await cookies();
  cookieStore.set("big-ticket--mode", theme, { ...defaultOpts, path: "/" });
  return `mode set to ${theme}`;
};

export const getTheme = async (): Promise<Modes> => {
  const cookieStore = await cookies();
  const light = "light";
  const mode = cookieStore.get("big-ticket--mode")?.value as Modes;
  return mode ?? light;
};

export const deleteThemes = async () => {
  const cookieStore = await cookies();
  return cookieStore.delete("big-ticket--mode");
};

////////////////////
//USER
export const setUserID = async (id: string) => {
  const cookieStore = await cookies();
  cookieStore.set("big-ticket--id", id, { ...defaultOpts, path: "/" });
};

export const getUserID = async () => {
  const cookieStore = await cookies();
  const id = cookieStore.get("big-ticket--id")?.value;
  return id ?? null;
};

export const deleteUserID = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("big-ticket--id");
  cookieStore.delete("big-ticket--account-id");
};

////////////////////
/// ACCOUNT_ID
export const setAccountID = async (id: string) => {
  const cookieStore = await cookies();
  cookieStore.set("big-ticket--account-id", id, { ...defaultOpts, path: "/" });
};
export const getAccountID = async () => {
  const cookieStore = await cookies();
  const id = cookieStore.get("big-ticket--account-id")?.value ?? null;
  return id;
};
export const deleteAccountID = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("big-ticket--account-id");
};
////////////////////
/// USER_EMAIL
export const setUserEmail = async (id: string) => {
  const cookieStore = await cookies();
  cookieStore.set("big-ticket--user-email", id, { ...defaultOpts, path: "/" });
};
export const getUserEmail = async () => {
  const cookieStore = await cookies();
  const id = cookieStore.get("big-ticket--user-email")?.value ?? null;
  return id;
};
export const deleteUserEmail = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("big-ticket--user-email");
};

export const fetchAllEvents = async () => {
  const events = await fetchQuery(api.events.get.all);
  return events;
};

export const preloadAllEvents = async () => preloadQuery(api.events.get.all);

export const preloadEventsByHostId = async () => {
  const host_id = await getAccountID();
  if (!host_id) return [];
  const preloadedEvents = await preloadQuery(api.events.get.byHostId, {
    host_id,
  });
  return preloadedQueryResult(preloadedEvents);
};

export const preloadEventsByCohostEmail = async (email: string[]) => {
  if (email[0] === "undefined") return [];
  const preloadedEvents = await preloadQuery(api.events.get.byCohostEmail, {
    email,
  });
  return preloadedQueryResult(preloadedEvents);
};

export const fetchUser = async () => {
  const userId = await getUserID();
  const acctId = await getAccountID();
  console.log(userId, acctId);
  if (!userId) return null;
  const user = await fetchQuery(api.users.get.byId, { id: userId });
  return user;
};

export const fetchId = async () => {
  return await getUserID();
};

export const preloadUser = async () => {
  const userId = await getUserID();
  if (!userId) return null;
  const preloadedUser = await preloadQuery(api.users.get.byId, { id: userId });
  const user = preloadedQueryResult(preloadedUser);
  return user;
};
