import { Hyper } from "@/ui/button/button";
import { type VIP } from "convex/events/d";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { sendEmail } from "@/lib/resend/callers";
import { Err } from "@/utils/helpers";

export interface XndInviteProps {
  vip_list: VIP[];
  updateSentStatus: (email: string, vip: VIP) => Promise<void>;
  createLog: (type: string, description?: string) => Promise<void>;
}

export const XndInvite = ({
  vip_list,
  updateSentStatus,
  createLog,
}: XndInviteProps) => {
  const [sending, setSending] = useState(false);

  const xnd = useCallback(async () => {
    setSending(true);

    await Promise.all(
      vip_list.map(async (vip) => {
        const promises = sendEmail({
          type: "VIP_INVITE",
          to: [vip.email],
          subject: "You have been invited to join our event",
          text: `You've got ${vip.ticket_count} VIP Tickets`,
          data: vip,
        });
        try {
          await toast.promise(promises, {
            loading: "Sending invitation...",
            success: "Invitation sent successfully!",
            error: "Failed to send invitation",
          });
          await updateSentStatus(vip.email, vip);
          await createLog(
            "email",
            `Sent invitation to ${vip.email}: successful`,
          );
        } catch (error) {
          console.error("Error sending email:", error);
          await createLog(
            "email",
            `${vip.email}: failed ${error instanceof Error ? error.message : "unknown error"}`,
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
  }, [vip_list, updateSentStatus, createLog]);

  const buttonLabel = sending
    ? `Sending...`
    : `Send Invitation${vip_list.length > 1 ? "s" : ` `}`;

  return (
    <Hyper
      onClick={xnd}
      disabled={sending || vip_list.length === 0}
      className={cn("portrait:w-full", {
        "w-40 animate-enter": vip_list.length <= 1,
        "text-primary": sending,
      })}
      label={buttonLabel}
      loading={sending}
      end={"mail-send"}
      fullWidth
      lg
    />
  );
};

/*

*/

// async function sendEmails() {
//   // setSending(true);

//   const promise = new Promise(async (resolve, reject) => {
//     const eventSource = new EventSource("/api/xnd/status");

//     eventSource.onmessage = (event) => {
//       console.log("Message received:", event.data);
//     };

//     eventSource.addEventListener("update", async (event) => {
//       const { recipient, status } = JSON.parse(event.data);

//       if (status === "sent") {
//         toast.success(`Email sent to ${recipient}`);
//         // await updateSentStatus(
//         //   recipient,
//         //   vip_list.find((vip) => vip.email === recipient)!,
//         // );
//       } else {
//         toast.error(`Failed to send email to ${recipient}`);
//       }
//     });

//     eventSource.addEventListener("done", () => {
//       eventSource.close();
//       // setSending(false);
//       resolve("All emails processed");
//     });

//     eventSource.addEventListener("error", (event) => {
//       eventSource.close();
//       // setSending(false);
//       reject("An error occurred while sending emails");
//     });

//     await toast.promise(promise, {
//       loading: "Sending emails...",
//       success: "All emails sent successfully!",
//       error: "An error occurred while sending emails.",
//     });
//   });
// }
