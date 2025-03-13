import type { AxiosRequestConfig, AxiosInstance } from "axios";
import { createChargeAxiosInstance } from "./axios-instance";
import type {
  Charge,
  CreateChargeParams,
  GetChargeParams,
} from "../schema/charges";

export const createCharge = async (
  data: CreateChargeParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: Charge }>("/", data, config);
  return res.data;
};

export const getCharge = async (
  data: GetChargeParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => await axiosInstance.get(`/${data.chargeId}`, config);

const createFn = <TParams, TReturn>(
  fn: (params: TParams, axiosInstance: AxiosInstance) => Promise<TReturn>,
  axiosInstance: AxiosInstance,
) => {
  return (data: TParams) => fn(data, axiosInstance);
};

const axiosInstance = createChargeAxiosInstance();
export const charges = {
  create: createFn(createCharge, axiosInstance),
  get: createFn(getCharge, axiosInstance),
};

// New function for methods with optional parameters
// const createNoParamFn = <TReturn>(
//   fn: (axiosInstance: AxiosInstance) => Promise<TReturn>,
//   axiosInstance: AxiosInstance,
// ) => {
//   return () => fn(axiosInstance);
// };
