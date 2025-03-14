"use client";

import { type SMTPResponse } from "@/app/api/send-invite/route";
import { onError } from "@/app/ctx/toast";
import { Hyper } from "@/ui/button/button";
import { type VIP } from "convex/events/d";
import { type MouseEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useEmailStatus } from "./useEmailStatus";
import { cn } from "@/lib/utils";

export interface SendInviteProps {
  vip_list: VIP[];
  updateSentStatus: (email: string, vip: VIP) => Promise<void>;
}

const SendInvite = ({ vip_list, updateSentStatus }: SendInviteProps) => {
  const [loading, setLoading] = useState(false);
  const { sendEmail, error } = useEmailStatus("send-email");

  const handleSendInvites = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (vip_list.length === 0) return;

      setLoading(true);

      try {
        const total = vip_list.length;
        let completed = 0;

        await Promise.all(
          vip_list.map(async (vip) => {
            try {
              await sendEmail(vip);
              completed++;
              await updateSentStatus(vip.email, vip);
            } catch (err) {
              console.error(`Failed to send to ${vip.email}:`, err, error);
              return;
            }
          }),
        );

        if (completed === total) {
          toast.success("All invitations sent!", {
            duration: 5000,
          });
          // console.log("Email Invites Sent:", emailInviteSent);
        } else {
          toast.success(`Sent ${completed} out of ${total} invitations`, {
            duration: 5000,
          });
        }
      } catch (err) {
        toast.error("Failed to send invitations", {});
        console.error(err, error);
      } finally {
        setLoading(false);
      }
    },
    [vip_list, sendEmail, error, updateSentStatus],
  );

  const buttonLabel = loading
    ? `Sending...`
    : `Send Invitation${vip_list.length > 1 ? "s" : ` `}`;

  return (
    <Hyper
      onClick={handleSendInvites}
      disabled={loading || vip_list.length === 0}
      className={cn({ "animate-enter": vip_list.length <= 1 })}
      label={buttonLabel}
      loading={loading}
      end="mail-send"
      fullWidth
      lg
    />
  );
};

export const sendInvite = async (vip: VIP) => {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: vip.email,
      name: vip.name,
      ticket_count: vip.ticket_count,
      event_id: vip.event_id,
      event_name: vip.event_name,
    }),
  });

  if (!res.ok) {
    onError(`Failed to send invite to ${vip.email}`);
  }
  return (await res.json()) as SMTPResponse;
};

export default SendInvite;
