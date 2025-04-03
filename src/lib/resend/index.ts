import { env } from "@/env";
import {
  type CreateEmailOptions,
  type CreateEmailRequestOptions,
  Resend,
} from "resend";

const resend = new Resend(env.RESEND_API).emails;

const send = async (
  payload: CreateEmailOptions,
  options?: CreateEmailRequestOptions,
) => resend.send(payload, options);
export { send };
