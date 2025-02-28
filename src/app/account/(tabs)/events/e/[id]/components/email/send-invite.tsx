"use client";

import { onError, onSuccess } from "@/app/ctx/toast";
import { Hyper } from "@/ui/button/button";
import { Err } from "@/utils/helpers";
import type { VIP } from "convex/events/d";
import { type MouseEvent, useCallback, useState } from "react";

export interface SendInviteProps {
  vip_list: VIP[] | undefined;
}

const SendInvite = ({ vip_list }: SendInviteProps) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendInvite = useCallback(async (vip: VIP) => {
    try {
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
        throw new Error(`Failed to send invite to ${vip.email}`);
      }

      const data = (await res.json()) as object;
      return data;
    } catch (error) {
      Err(setLoading);
      throw error;
    }
  }, []);

  const handleSendInvites = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!vip_list?.length) return;

      setLoading(true);
      setProgress(0);

      try {
        const total = vip_list.length;
        let sent = 0;

        // Use Promise.all with map for concurrent execution
        await Promise.all(
          vip_list.map(async (vip) => {
            try {
              await sendInvite(vip);
              sent++;
              setProgress(Math.round((sent / total) * 100));
            } catch (error) {
              onError(`Failed to send invite to ${vip.email}`);
              console.error(error);
            }
          }),
        );

        if (sent === total) {
          onSuccess("All invitations sent successfully!");
        } else if (sent > 0) {
          onSuccess(`Sent ${sent} out of ${total} invitations`);
        }
      } catch (error) {
        Err(setLoading);
        onError("Failed to send invitations");
        console.error(error);
      } finally {
        setLoading(false);
        setProgress(0);
      }
    },
    [vip_list, sendInvite],
  );

  const buttonLabel = loading
    ? `Sending... ${progress}%`
    : `Send Invitation${(vip_list?.length ?? 0) > 1 ? "s" : ""}`;

  return (
    <Hyper
      onClick={handleSendInvites}
      disabled={loading || !vip_list?.length}
      label={buttonLabel}
      loading={loading}
    />
  );
};

export default SendInvite;
