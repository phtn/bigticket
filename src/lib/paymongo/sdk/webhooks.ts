import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  WebhookResource,
  CreateWebhookParams,
  RetrieveWebhookParams,
  EnableWebhookParams,
  DisableWebhookParams,
  UpdateWebhookParams,
} from "@/lib/paymongo/schema/zod.webhook";

export const createWebhook = async (
  data: CreateWebhookParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: WebhookResource }>(
    "/webhooks",
    { data },
    config,
  );

  return res.data.data;
};

export const retrieveWebhook = async (
  data: RetrieveWebhookParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: WebhookResource }>(
    `/webhooks/${data.id}`,
    config,
  );

  return res.data.data;
};

export const listWebhooks = async (
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: WebhookResource[] }>(
    "/webhooks",
    config,
  );

  return res.data.data;
};

export const enableWebhook = async (
  data: EnableWebhookParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: WebhookResource }>(
    `/webhooks/${data.id}/enable`,
    {},
    config,
  );

  return res.data.data;
};

export const disableWebhook = async (
  data: DisableWebhookParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: WebhookResource }>(
    `/webhooks/${data.id}/disable`,
    {},
    config,
  );

  return res.data.data;
};

export const updateWebhook = async (
  data: UpdateWebhookParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.put<{ data: WebhookResource }>(
    `/webhooks/${data.id}`,
    { data },
    config,
  );

  return res.data.data;
};
