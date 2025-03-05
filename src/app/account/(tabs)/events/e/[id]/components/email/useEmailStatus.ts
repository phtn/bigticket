import { useState } from "react";
import type { VIP } from "convex/events/d";
import toast from "react-hot-toast";

export function useEmailStatus<T extends VIP>(endpoint: string) {
  const [error, setError] = useState<Error | null>(null);

  const sendEmail = async (data: T) => {
    console.log(`/api/${endpoint}`);
    const toastId = toast.loading("Sending email...");

    try {
      const response = await fetch(`/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          ticket_count: data.ticket_count,
          event_id: data.event_id,
          event_name: data.event_name,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value).trim();
        // const events = text.split("\n\n").filter(Boolean);

        // events.forEach((event) => {
        //   const data = JSON.parse(event.replace("data: ", "")) as EmailStatus;
        //   setStatus((prev) => [...prev, data]);
        // });
        console.log(text);
        toast.loading(text, { duration: Infinity, id: toastId });
      }
      toast.success(`Sent to ${data.email}`, { id: toastId, duration: 5000 });
    } catch (err) {
      toast.error("Sending email failed", { id: toastId, duration: 5000 });
      setError(err instanceof Error ? err : new Error("Failed to send email"));
      console.error(err);
    }
  };

  return { error, sendEmail };
}
