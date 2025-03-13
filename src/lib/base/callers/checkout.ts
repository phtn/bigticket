"use server";

import { asyncFn } from "@/lib/paymongo/utils";
import { api } from "@/trpc/server";

export const createCheckout = asyncFn(api.base.createCheckout);
export const getCheckout = asyncFn(api.base.getCheckout);
