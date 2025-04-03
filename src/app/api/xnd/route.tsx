import { NextResponse } from "next/server";
import { getEmailTemplate } from "@/lib/resend/utils";
import { type EmailOptions, EmailOptionsSchema } from "@/lib/resend/schema";
import { send } from "@/lib/resend";
import { render } from "@react-email/render";

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey === "") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as EmailOptions;
  const parsedData = EmailOptionsSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!parsedData.data) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { to, subject, type, data, attachments, text } = parsedData.data;

  for (const recipient of to) {
    const emailHtml = render(getEmailTemplate(type, data), {
      pretty: true,
    });

    try {
      const { data, error } = await send({
        from: "Big Ticket <hq@bigticket.ph>",
        to: [recipient],
        subject: subject ?? "",
        text: text,
        html: await emailHtml,
        attachments: attachments ?? [],
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }
}

/*


 const { readable, writable } = new TransformStream();
 const writer = writable.getWriter();
 const encoder = new TextEncoder();

 try {
   const body = await req.json();
   const parsedData = EmailOptionsSchema.safeParse(body);

   if (!parsedData.success) {
     await writer.write(
       encoder.encode(
         `event: error\ndata: ${JSON.stringify(parsedData.error.errors)}\n\n`,
       ),
     );
     writer.close();
     return NextResponse.json(readable, { status: 400 });
   }

   const { to, subject, type, data, attachments } =
     parsedData.data as EmailOptions;

   for (const recipient of to) {
     const emailHtml = render(getEmailTemplate(type, data));

     try {
       const response = await send({
         from: `Big Ticket <${env.SMTP_USER}>`,
         to: recipient,
         subject: subject ?? "",
         react: emailHtml,
         attachments,
         headers: {
           "X-Priority": "1",
           "X-MSMail-Priority": "High",
           Importance: "high",
         },
         text: `You have ${body.ticket_count} VIP tickets!`,
       });

       await writer.write(
         encoder.encode(
           `event: update\ndata: ${JSON.stringify({ recipient, status: "sent", response })}\n\n`,
         ),
       );
     } catch (error) {
       await writer.write(
         encoder.encode(
           `event: update\ndata: ${JSON.stringify({ recipient, status: "failed", error })}\n\n`,
         ),
       );
     }
   }

   await writer.write(encoder.encode("event: done\ndata: {}\n\n"));
   writer.close();
 } catch (error) {
   await writer.write(
     encoder.encode(
       `event: error\ndata: ${JSON.stringify({ error: "Failed to send email" })}\n\n`,
     ),
   );
   writer.close();
   return NextResponse.json(readable, { status: 500 });
 }

 return NextResponse.json(readable, {
   headers: {
     "Content-Type": "text/event-stream",
     "Cache-Control": "no-cache",
     Connection: "keep-alive",
   },
 });
*/
