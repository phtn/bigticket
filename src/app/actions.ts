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
};

////////////////////
/// ACCOUNT
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

export const fetchAllEvents = async () => {
  const events = await fetchQuery(api.events.get.all);
  return events;
};

export const preloadAllEvents = async () => {
  const preloadedEvents = await preloadQuery(api.events.get.all);
  // const events = preloadedQueryResult(preloadedEvents);
  return preloadedEvents;
};

export const preloadEventsByHostId = async (host_id: string | null) => {
  if (!host_id) return [];
  const preloadedEvents = await preloadQuery(api.events.get.byHostId, {
    host_id,
  });
  const events = preloadedQueryResult(preloadedEvents);
  return events;
};

export const fetchUser = async () => {
  const userId = await getUserID();
  console.log(userId);
  if (!userId) return null;
  const user = await fetchQuery(api.users.get.byId, { id: userId });
  return user;
};

export const preloadUser = async () => {
  const userId = await getUserID();
  console.log(userId);
  if (!userId) return null;
  const preloadedUser = await preloadQuery(api.users.get.byId, { id: userId });
  const user = preloadedQueryResult(preloadedUser);
  return user;
};
