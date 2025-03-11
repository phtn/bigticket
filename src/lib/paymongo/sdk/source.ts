import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  CreateSourceParams,
  RetrieveSourceParams,
  SourceError,
  SourceResource,
} from "@/lib/paymongo/schema/zod.source";

export const createSource = async (
  data: CreateSourceParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: SourceResource }>(
    "/sources",
    data,
    config,
  );

  return res.data.data;
};

export const retrieveSource = async (
  data: RetrieveSourceParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: SourceResource }>(
    `sources/${data.id}`,
    config,
  );

  return res.data.data;
};

export const sourceError = (err: SourceError) => ({
  pointer: err.pointer,
  attribute: err.attribute,
});
