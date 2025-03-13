import { env } from "@/env";
import axios, { type AxiosRequestConfig } from "axios";

export const createCheckoutAxiosInstance = (config?: AxiosRequestConfig) =>
  axios.create({
    ...config,
    headers: {
      common: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CC-Api-Key": env.CC_API_KEY,
      },
      ...config?.headers,
    },
    baseURL: "https://api.commerce.coinbase.com/checkouts",
  }); 