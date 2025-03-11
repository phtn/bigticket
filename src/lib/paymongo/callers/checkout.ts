"use server";

import { asyncFn } from "@/lib/paymongo/utils";
import { api } from "@/trpc/server";

export const createCheckout = asyncFn(api.paymongo.createCheckout);
