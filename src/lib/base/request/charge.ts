import type { AxiosRequestConfig, AxiosInstance } from "axios";
import { createBaseAxiosInstance } from "../callers/axios-instance";
import type { CreateChargeParams } from "../schema/charge";

export const createCharge = async (
  data: CreateChargeParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post("/createCharge", data, config);

  const { id } = res.data as { id: string };
  return id;
};
const createFn = <TParams, TReturn>(
  fn: (params: TParams, axiosInstance: AxiosInstance) => Promise<TReturn>,
  axiosInstance: AxiosInstance,
) => {
  return (data: TParams) => fn(data, axiosInstance);
};

// New function for methods with optional parameters
// const createNoParamFn = <TReturn>(
//   fn: (axiosInstance: AxiosInstance) => Promise<TReturn>,
//   axiosInstance: AxiosInstance,
// ) => {
//   return () => fn(axiosInstance);
// };

const baseAxiosInstance = createBaseAxiosInstance();
export const base = {
  charge: {
    create: createFn(createCharge, baseAxiosInstance),
  },
};
