"use server";

import { asyncFn } from "@/server/api/utils";
import { api } from "@/trpc/server";

export const createCustomer = asyncFn(api.paymongo.createCustomer);

export const retrieveCustomer = asyncFn(api.paymongo.retrieveCustomer);

export const editCustomer = asyncFn(api.paymongo.editCustomer);

// export const listAllCustomers = asyncFn(trpc.paymongo.listAllCustomers);
