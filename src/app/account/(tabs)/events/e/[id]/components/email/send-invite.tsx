"use client";

import { Hyper } from "@/ui/button/button";
import { Err, Ok } from "@/utils/helpers";
import { useState } from "react";

const SendInvite = () => {
  const [loading, setLoading] = useState(false);

  const sendInvite = async () => {
    setLoading(true);

    const res = await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "hq@bigticket.ph",
        name: "XPRIORI",
        ticket_count: 5,
      }),
    });

    await res.json().then(Ok(setLoading)).catch(Err);
  };
  return (
    <Hyper onClick={sendInvite} disabled={loading}>
      {loading ? "Sending..." : "Send Invitation"}
    </Hyper>
  );
};

export default SendInvite;
