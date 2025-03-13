import type { AxiosRequestConfig, AxiosInstance } from "axios";
import { createCheckoutAxiosInstance } from "./axios-checkout-instance";
import type {
  CreateCheckoutParams,
  GetCheckoutParams,
} from "../schema/checkout";

export const createCheckout = async (
  data: CreateCheckoutParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ id: string }>("/", data, config);

  const { id } = res.data as { id: string };
  return id;
};

export const getCheckout = async (
  data: GetCheckoutParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => await axiosInstance.get(`/${data.checkoutId}`, config);

const createFn = <TParams, TReturn>(
  fn: (params: TParams, axiosInstance: AxiosInstance) => Promise<TReturn>,
  axiosInstance: AxiosInstance,
) => {
  return (data: TParams) => fn(data, axiosInstance);
};

const axiosInstance = createCheckoutAxiosInstance();
export const checkout = {
  create: createFn(createCheckout, axiosInstance),
  get: createFn(getCheckout, axiosInstance),
};
