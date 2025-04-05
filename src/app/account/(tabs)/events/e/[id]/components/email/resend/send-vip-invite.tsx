import { Hyper } from "@/ui/button/button";
import type { Cohost, VIP } from "convex/events/d";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { sendEmail } from "@/lib/resend/callers";
import { Err } from "@/utils/helpers";
import { type EmailType } from "@/lib/resend/schema";
// import { VIPWithDefaults } from "../../details/vip/types";

type ListType<T extends EmailType> = T extends "VIP_INVITE"
  ? VIP[]
  : T extends "COHOST_INVITE"
    ? Cohost[]
    : never;

type DataType<T extends EmailType> = T extends "VIP_INVITE"
  ? VIP
  : T extends "COHOST_INVITE"
    ? Cohost
    : never;

export interface XndInviteProps<T extends EmailType> {
  type: T;
  list: ListType<T>;
  createLog: (type: string, description?: string) => Promise<void>;
  updateSentStatus: (email: string, data: DataType<T>) => Promise<void>;
  host?: string;
}

export const XndInvite = <T extends EmailType>({
  host,
  list,
  type,
  createLog,
  updateSentStatus,
}: XndInviteProps<T>) => {
  const [sending, setSending] = useState(false);

  const text = useCallback(
    (data: VIP | Cohost) => {
      if (type === "VIP_INVITE") {
        const vip = data as Pick<VIP, "ticket_count">;
        return `You've got ${vip.ticket_count} VIP Tickets`;
      } else if (type === "COHOST_INVITE") {
        return `You are invited to be a cohost`;
      }
    },
    [type],
  );

  const xnd = useCallback(async () => {
    setSending(true);
    await Promise.all(
      list.map(async (item) => {
        item = type === "VIP_INVITE" ? (item as VIP) : (item as Cohost);
        const promises = sendEmail({
          type,
          to: [item.email],
          subject: "You're invited to join our event",
          text: text(item),
          data: { ...item, host },
        });
        try {
          await toast.promise(promises, {
            loading: "Sending invitation...",
            success: "Invitation sent successfully!",
            error: "Failed to send invitation",
          });
          await updateSentStatus(item.email, item as DataType<typeof type>);
          await createLog(
            "email",
            `Sent invitation to ${item.email}: successful`,
          );
        } catch (error) {
          console.error("Error sending email:", error);
          await createLog(
            "email",
            `${item.email}: failed ${error instanceof Error ? error.message : "unknown error"}`,
          );
        } finally {
          setSending(false);
        }
      }),
    )
      .then((res) => {
        console.log(res);
      })
      .catch(Err(setSending));
  }, [list, updateSentStatus, createLog, host, text, type]);

  const buttonLabel = sending
    ? ``
    : `Send Invitation${list.length > 1 ? "s" : ` `}`;

  return (
    <Hyper
      onClick={xnd}
      disabled={sending || list.length === 0}
      className={cn(
        "rounded-br-lg border-t border-macl-gray/60 portrait:w-full",
        {
          "w-40 animate-enter": list.length <= 1,
          "text-primary": sending,
        },
      )}
      label={buttonLabel}
      loading={sending}
      end={"mail-send-2"}
      fullWidth
      lg
    />
  );
};
