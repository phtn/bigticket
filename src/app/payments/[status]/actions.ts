"use server";

import { env } from "@/env";
import { cookies } from "next/headers";

const defaultOpts = {
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax" as const,
};

export const storePaymentId = async (id: string) => {
  const cookieStore = await cookies();
  cookieStore.set("bigticket--pid", id, defaultOpts);
};
export const getPaymentId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("bigticket--pid")?.value;
};
