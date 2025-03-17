import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  CreatePaymentIntentParams,
  PaymentIntentResource,
  RetrievePaymentIntentParamsUsingPublic,
  AttachPaymentIntentParamsUsingPublic,
  BaseRetrievePaymentIntentParams,
} from "@/lib/paymongo/schema/zod.payment-intent";

export const createPaymentIntent = async (
  data: CreatePaymentIntentParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: PaymentIntentResource }>(
    "/payment_intents",
    data,
    config,
  );

  return res.data.data;
};

export const retrievePaymentIntent = async (
  data: BaseRetrievePaymentIntentParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: PaymentIntentResource }>(
    `/payment_intents/${data.id}`,
    config,
  );
  return res.data.data;
};

export const retrievePaymentIntentUsingPublic = async (
  data: RetrievePaymentIntentParamsUsingPublic,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const { id, client_key } = data;

  const res = await axiosInstance.get<{ data: PaymentIntentResource }>(
    `/payment_intents/${id}`,
    {
      params: { client_key },
      ...config,
    },
  );

  return res.data.data;
};

export const attachPaymentIntent = async (
  data: AttachPaymentIntentParamsUsingPublic,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const { id, ...params } = data;
  const res = await axiosInstance.post<{ data: PaymentIntentResource }>(
    `/payment_intents/${id}/attach`,
    params,
    config,
  );

  return res.data.data;
};
