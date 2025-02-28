"use client";

import { Hyper } from "@/ui/button/button";
import { Err } from "@/utils/helpers";
import type { VIP } from "convex/events/d";
import { type MouseEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";

export interface SendInviteProps {
  vip_list: VIP[];
}

const SendInvite = ({ vip_list }: SendInviteProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);

  const handleSendInvites = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (vip_list.length === 0) return;

      setLoading(true);
      setProgress(0);

      // Use Promise.all with map for concurrent execution
      const promises = Promise.all(
        vip_list.map(async (vip) => {
          await sendInvite(vip).then(() => {
            setSent((prev) => prev + 1);
            setProgress(Math.round((sent / vip_list.length) * 100));
          });
        }),
      );

      await toast
        .promise(promises, {
          loading: `Sending invitations... ${sent}/${vip_list.length} (${progress}%)`,
          success: "All invitations sent successfully!",
          error: "Failed to send invitations",
        })
        .catch(Err);
    },
    [vip_list, progress, sent],
  );

  const buttonLabel = loading
    ? `Sending... ${progress}%`
    : `Send Invitation${vip_list.length > 1 ? "s" : ""}  (${vip_list.length}) `;

  return (
    <Hyper
      onClick={handleSendInvites}
      disabled={loading || vip_list.length === 0}
      label={buttonLabel}
      loading={loading}
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

  await res.json().catch(Err);
};

export default SendInvite;
