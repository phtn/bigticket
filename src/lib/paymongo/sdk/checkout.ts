import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  CheckoutParams,
  CheckoutResource,
  RetrieveCheckoutParams,
  ExpireCheckoutParams,
} from "@/lib/paymongo/schema/zod.checkout";

export const createCheckoutSession = async (
  data: CheckoutParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: CheckoutResource }>(
    "/checkout_sessions",
    data,
    config,
  );

  return res.data.data;
};

export const retrieveCheckoutSession = async (
  values: RetrieveCheckoutParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: CheckoutResource }>(
    `/checkout_sessions/${values.checkout_session_id}`,
    config,
  );

  return res.data.data;
};

export const expireCheckoutSession = async (
  values: ExpireCheckoutParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: CheckoutResource }>(
    `/checkout_sessions/${values.checkout_session_id}/expire`,
    config,
  );

  return res.data.data;
};
