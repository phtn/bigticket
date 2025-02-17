"use client";

import { Hyper } from "@/ui/button/button";
import { Err, Ok } from "@/utils/helpers";
import { useState } from "react";

const SendTicket = () => {
  const [loading, setLoading] = useState(false);

  const sendTicketEmail = async () => {
    setLoading(true);

    const res = await fetch("/api/send-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "hq@bigticket.ph",
        customerName: "XPRIORI",
        eventName: "Ultra Music Festival 2025",
        eventDate: "March 15, 2025",
        eventTime: "7:00 PM",
        venue: "Miami Beach, FL",
        seat: "VIP Section - A12",
        qrCode: "https://your-cdn.com/qrcodes/sample.png",
        ticketDownloadLink: "https://your-website.com/download-ticket/123456",
      }),
    });

    await res.json().then(Ok(setLoading)).catch(Err);
  };

  return (
    <Hyper onClick={sendTicketEmail} disabled={loading}>
      {loading ? "Sending..." : "Send VIP Ticket"}
    </Hyper>
  );
};

export default SendTicket;
