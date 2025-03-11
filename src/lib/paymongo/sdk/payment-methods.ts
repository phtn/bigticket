import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  CreatePaymentMethodParams,
  PaymentMethodResource,
  RetrievePaymentMethodParams,
} from "@/lib/paymongo/schema/zod.payment-methods";

export const createPaymentMethod = async (
  data: CreatePaymentMethodParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: PaymentMethodResource }>(
    "/payment_methods",
    data,
    config,
  );

  return res.data.data;
};

export const retreivePaymentMethod = async (
  data: RetrievePaymentMethodParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: PaymentMethodResource }>(
    `/payment_methods/${data.id}`,
    config,
  );

  return res.data.data;
};
