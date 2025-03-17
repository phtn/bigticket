"use server";

import { api } from "@/trpc/server";

const asyncFn =
  <TParams, TReturn>(fn: (params: TParams) => Promise<TReturn>) =>
  async (params: TParams) =>
    await fn(params);

export const createCheckout = asyncFn(api.paymongo.createCheckout);
export const retrievePaymentIntent = asyncFn(
  api.paymongo.retrievePaymentIntent,
);
