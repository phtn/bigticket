"use server";

import { env } from "@/env";
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
  return id;
};

export const deleteUserID = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("big-ticket--id");
};
