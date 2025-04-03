import { type EmailOptions } from "@/lib/resend/schema";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { createAxiosInstance } from "@/server/api/axios";
import { axFn } from "@/server/api/utils";

export const sendEmail = async (
  data: EmailOptions,
  ax: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const response = await ax.post<object | null>("/xnd", data, config);
  return response.data;
};

const ax = createAxiosInstance();

export const email = {
  send: axFn(sendEmail, ax),
};
