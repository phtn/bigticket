import type { SecretOrPublicKey } from "@/lib/paymongo/schema/zod.common";
import type { AxiosInstance } from "axios";
import { createAxiosInstance } from "@/lib/paymongo/sdk/axios-instance";

import {
  createPaymentMethod,
  retreivePaymentMethod,
} from "@/lib/paymongo/sdk/payment-methods";
import {
  retrievePaymentIntent,
  attachPaymentIntent,
  createPaymentIntent,
} from "@/lib/paymongo/sdk/payment-intent";
import { createSource, retrieveSource } from "@/lib/paymongo/sdk/source";
import {
  createPayment,
  listAllPayments,
  retrievePayment,
} from "@/lib/paymongo/sdk/payments";
import {
  createCheckoutSession,
  expireCheckoutSession,
  retrieveCheckoutSession,
} from "@/lib/paymongo/sdk/checkout";
import { createRefund, retrieveRefund } from "@/lib/paymongo/sdk/refund";
import {
  createCustomer,
  retrieveCustomer,
  editCustomer,
  deleteCustomer,
} from "@/lib/paymongo/sdk/customer";
import {
  createWebhook,
  retrieveWebhook,
  listWebhooks,
  enableWebhook,
  disableWebhook,
  updateWebhook,
} from "@/lib/paymongo/sdk/webhooks";
import {
  createLink,
  retrieveLink,
  getLinkByReferenceNumber,
  archiveLink,
  unarchiveLink,
} from "@/lib/paymongo/sdk/link";

const btoa = (string: string) => {
  if (typeof window === "undefined") {
    return Buffer.from(string).toString("base64");
  }
  return window.btoa(string);
};

const createFn = <TParams, TReturn>(
  fn: (params: TParams, axiosInstance: AxiosInstance) => Promise<TReturn>,
  axiosInstance: AxiosInstance,
) => {
  return (data: TParams) => fn(data, axiosInstance);
};

// New function for methods with optional parameters
const createNoParamFn = <TReturn>(
  fn: (axiosInstance: AxiosInstance) => Promise<TReturn>,
  axiosInstance: AxiosInstance,
) => {
  return () => fn(axiosInstance);
};

const Paymongo = (key: SecretOrPublicKey) => {
  const axiosInstance = createAxiosInstance({
    headers: {
      Authorization: `Basic ${btoa(key)}`,
    },
  });

  const isSecret = key.includes("sk");

  if (typeof window !== "undefined" && isSecret) {
    throw new Error("Do not use the secret key in the browser");
  }

  return {
    paymentMethod: {
      create: createFn(createPaymentMethod, axiosInstance),
      retrieve: createFn(retreivePaymentMethod, axiosInstance),
    },
    paymentIntent: {
      create: createFn(createPaymentIntent, axiosInstance),
      retrieve: createFn(retrievePaymentIntent, axiosInstance),
      attach: createFn(attachPaymentIntent, axiosInstance),
    },
    source: {
      create: createFn(createSource, axiosInstance),
      retrieve: createFn(retrieveSource, axiosInstance),
    },
    payment: {
      create: createFn(createPayment, axiosInstance),
      retrieve: createFn(retrievePayment, axiosInstance),
      list: createFn(listAllPayments, axiosInstance),
    },
    checkout: {
      create: createFn(createCheckoutSession, axiosInstance),
      retrieve: createFn(retrieveCheckoutSession, axiosInstance),
      expire: createFn(expireCheckoutSession, axiosInstance),
    },
    refund: {
      create: createFn(createRefund, axiosInstance),
      retrieve: createFn(retrieveRefund, axiosInstance),
    },
    customer: {
      create: createFn(createCustomer, axiosInstance),
      retrieve: createFn(retrieveCustomer, axiosInstance),
      edit: createFn(editCustomer, axiosInstance),
      delete: createFn(deleteCustomer, axiosInstance),
    },
    webhook: {
      create: createFn(createWebhook, axiosInstance),
      retrieve: createFn(retrieveWebhook, axiosInstance),
      list: createNoParamFn(listWebhooks, axiosInstance),
      enable: createFn(enableWebhook, axiosInstance),
      disable: createFn(disableWebhook, axiosInstance),
      update: createFn(updateWebhook, axiosInstance),
    },
    link: {
      create: createFn(createLink, axiosInstance),
      retrieve: createFn(retrieveLink, axiosInstance),
      getByReferenceNumber: createFn(getLinkByReferenceNumber, axiosInstance),
      archive: createFn(archiveLink, axiosInstance),
      unarchive: createFn(unarchiveLink, axiosInstance),
    },
  };
};

export { Paymongo };
