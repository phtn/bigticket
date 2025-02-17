import type { EmailData } from "@/app/types";

// Send a simple email
export const simpleEmail: EmailData = {
  to: "user@example.com",
  subject: "Hello",
  html: "<p>Simple message</p>",
};

// Send with template
export const templateEmail: EmailData = {
  to: "user@example.com",
  subject: "Welcome to MyApp",
  template: "welcome",
  templateData: {
    appName: "MyApp",
    userName: "John",
    verificationLink: "https://example.com/verify",
  },
};

// Bulk send with attachments
export const bulkEmail: EmailData = {
  to: ["user1@example.com", "user2@example.com"],
  subject: "Documents",
  html: "<p>See attached</p>",
  attachments: [
    {
      filename: "doc.pdf",
      path: "/path/to/doc.pdf",
      contentType: "application/pdf",
    },
  ],
};

// const sendTestEmail = useCallback(async () => {
//     console.log("send triggered");
//     const res = await fetch("/api/email", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         to: "hq@bigticket.ph",
//         template: "welcome",
//         templateData: {
//           appName: "BigTicket",
//           userName: "Pink",
//           verificationLink: "https://bigticket.ph/verify",
//         },
//       }),
//     });
//     console.log(res.json());
//   }, []);
