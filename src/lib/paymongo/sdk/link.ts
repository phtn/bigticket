import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  LinkResource,
  CreateLinkParam,
  RetrieveLinkParam,
  GetLinkByRefParam,
  ArchiveLinkParam,
  UnarchiveLinkParam,
} from "@/lib/paymongo/schema/zod.link";

export const createLink = async (
  data: CreateLinkParam,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: LinkResource }>(
    "/links",
    { data },
    config,
  );

  return res.data.data;
};

export const retrieveLink = async (
  data: RetrieveLinkParam,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: LinkResource }>(
    `/links/${data.id}`,
    config,
  );

  return res.data.data;
};

export const getLinkByReferenceNumber = async (
  data: GetLinkByRefParam,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: LinkResource }>(
    `/links?reference_number=${data.reference_number}`,
    config,
  );

  return res.data.data;
};

export const archiveLink = async (
  data: ArchiveLinkParam,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: LinkResource }>(
    `/links/${data.id}/archive`,
    {},
    config,
  );

  return res.data.data;
};

export const unarchiveLink = async (
  data: UnarchiveLinkParam,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: LinkResource }>(
    `/links/${data.id}/unarchive`,
    {},
    config,
  );

  return res.data.data;
};
