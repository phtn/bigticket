import { env } from "@/env";
import axios, { type AxiosRequestConfig } from "axios";

export const createAxiosInstance = (config?: AxiosRequestConfig) =>
  axios.create({
    ...config,
    headers: {
      common: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": env.RE_UP_API,
      },
      ...config?.headers,
    },
    baseURL:
      env.NODE_ENV === "production"
        ? "https://bigticket.ph/api"
        : "http://localhost:3000/api",
  });
