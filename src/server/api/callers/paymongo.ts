"use server";

import { api } from "@/trpc/server";
import { asyncFn } from "../utils";

export const createCheckout = asyncFn(api.paymongo.createCheckout);
export const retrievePaymentIntent = asyncFn(
  api.paymongo.retrievePaymentIntent,
);
