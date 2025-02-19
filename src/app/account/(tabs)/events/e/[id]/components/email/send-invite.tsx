"use client";

import { Hyper } from "@/ui/button/button";
import { Err, Ok } from "@/utils/helpers";
import type { VIP } from "convex/events/d";
import { type MouseEvent, useState } from "react";

export interface SendInviteProps {
  vip_list: VIP[] | undefined;
}
const SendInvite = ({ vip_list }: SendInviteProps) => {
  const [loading, setLoading] = useState(false);

  const sendInvite = async (vip: VIP) => {
    setLoading(true);

    const res = await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: vip.email,
        name: vip.name,
        ticket_count: vip.ticket_count,
      }),
    });

    await res.json().then(Ok(setLoading)).catch(Err);
  };

  const handleSendInvites = (e: MouseEvent) => {
    e.preventDefault();
    vip_list?.forEach((vip) => {
      (async () => {
        await sendInvite(vip);
      })()
        .then(Ok(setLoading))
        .catch(Err(setLoading));
    });
  };

  return (
    <Hyper
      onClick={handleSendInvites}
      disabled={loading || !vip_list || vip_list.length === 0}
      label={loading ? "Sending..." : `Send Invitation`}
    ></Hyper>
  );
};

export default SendInvite;
