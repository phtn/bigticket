import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  CreateCustomerParams,
  RetrieveCustomerParams,
  CustomerResource,
  EditCustomerParams,
  DeleteCustomerParams,
} from "@/lib/paymongo/schema/zod.customer";

export const createCustomer = async (
  data: CreateCustomerParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: CustomerResource }>(
    "/customers",
    data,
    config,
  );

  return res.data.data;
};

export const retrieveCustomer = async (
  data: RetrieveCustomerParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: CustomerResource }>(
    `customers/${data.id}`,
    config,
  );

  return res;
};

export const editCustomer = async (
  data: EditCustomerParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.put<{ data: CustomerResource }>(
    `customers/${data.id}`,
    data,
    config,
  );

  return res.data.data;
};

export const deleteCustomer = async (
  data: DeleteCustomerParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.delete<{ data: CustomerResource }>(
    `customers/${data.id}`,
    config,
  );

  return res.data.data;
};
