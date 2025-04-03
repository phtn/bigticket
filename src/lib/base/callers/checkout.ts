"use server";

import { asyncFn } from "@/server/api/utils";
import { api } from "@/trpc/server";

export const createCheckout = asyncFn(api.base.createCheckout);
export const getCheckout = asyncFn(api.base.getCheckout);
