import { proc, router } from "../trpc";
import { EmailOptionsSchema } from "@/lib/resend/schema";
import { asyncR } from "../utils";
import { email } from "@/lib/resend/handlers";

const send = proc.input(EmailOptionsSchema);
export const resendRouter = router({
  send: send.mutation(asyncR(email.send)),
});
