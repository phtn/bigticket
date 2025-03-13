"use server";

import { asyncFn } from "@/lib/paymongo/utils";
import { api } from "@/trpc/server";

export const createCharge = asyncFn(api.base.createCharge);
export const getCharge = asyncFn(api.base.getCharge);
