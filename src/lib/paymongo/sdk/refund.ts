import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  RefundResource,
  CreateRefundParams,
  RetrieveRefundParams,
} from "@/lib/paymongo/schema/zod.refund";

export const createRefund = async (
  data: CreateRefundParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.post<{ data: RefundResource }>(
    "/refunds",
    { data },
    config,
  );

  return res.data.data;
};

export const retrieveRefund = async (
  data: RetrieveRefundParams,
  axiosInstance: AxiosInstance,
  config?: AxiosRequestConfig,
) => {
  const res = await axiosInstance.get<{ data: RefundResource }>(
    `/refunds/${data.id}`,
    config,
  );

  return res.data.data;
};

// export const listAllRefunds = async (
//   data: ListAllRefundsParam,
//   axiosInstance: AxiosInstance,
//   config?: AxiosRequestConfig,
// ) => {
//   const queryParams = new URLSearchParams();
//   if (data.payment_id) queryParams.append("payment_id", data.payment_id);
//   if (data.limit) queryParams.append("limit", data.limit.toString());
//   if (data.before) queryParams.append("before", data.before);
//   if (data.after) queryParams.append("after", data.after);

//   const res = await axiosInstance.get<{ data: RefundResource[] }>(
//     `/refunds?${queryParams.toString()}`,
//     config,
//   );

//   return res.data.data;
// };
