"use client";

import { type SMTPResponse } from "@/app/api/send-invite/route";
import { onError } from "@/app/ctx/toast";
import { Hyper } from "@/ui/button/button";
import { type VIP } from "convex/events/d";
import { type MouseEvent, useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

export interface SendInviteProps {
  vip_list: VIP[];
  updateSentStatus: (email: string, vip: VIP) => Promise<void>;
}

const SendInvite = ({ vip_list, updateSentStatus }: SendInviteProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);
  // const [emailInviteSent, setEmailInviteSent] = useState<string[]>([]);
  const toastId = useRef<string | null>(null);

  const handleSendInvites = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (vip_list.length === 0) return;

      setLoading(true);

      try {
        const total = vip_list.length;
        let completed = 0;

        // Create initial toast
        toastId.current = toast.loading(
          `Sending Invitations ${completed}/${total} ・ ${0}%`,
          {
            duration: Infinity,
          },
        );

        // Process emails
        await Promise.all(
          vip_list.map(async (vip) => {
            try {
              await sendInvite(vip);
              completed++;
              setSent(completed);
              const newProgress = Math.round((sent / total) * 100);
              setProgress(newProgress);
              // setEmailInviteSent((prev) => [...prev, vip.email]);
              // Update progress state
              await updateSentStatus(vip.email, vip);

              // Update toast message
              if (toastId.current) {
                toast.loading(
                  `Sending invitations ${sent}/${total} ・ ${progress}%`,
                  { id: toastId.current },
                );
              }
            } catch (error) {
              console.error(`Failed to send to ${vip.email}:`, error);
              return;
            }
          }),
        );

        // Update final toast state
        if (toastId.current) {
          if (completed === total) {
            toast.success("All invitations sent!", {
              id: toastId.current,
              duration: 5000,
            });
            // console.log("Email Invites Sent:", emailInviteSent);
          } else {
            toast.success(`Sent ${completed} out of ${total} invitations`, {
              id: toastId.current,
              duration: 5000,
            });
          }
        }
      } catch (error) {
        // Handle errors
        if (toastId.current) {
          toast.error("Failed to send invitations", {
            id: toastId.current,
          });
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [vip_list, sent, progress, updateSentStatus],
  );

  const buttonLabel = loading
    ? `Sending... ${progress}%`
    : `Send Invitation${vip_list.length > 1 ? "s" : ""}`;

  return (
    <Hyper
      onClick={handleSendInvites}
      disabled={loading || vip_list.length === 0}
      label={buttonLabel}
      loading={loading}
      fullWidth
      xl
      end="MailSend"
    />
  );
};

const sendInvite = async (vip: VIP) => {
  const res = await fetch("/api/send-invite", {
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
