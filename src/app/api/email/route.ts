import { type NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import type { EmailData } from "@/app/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailData;

    // Validate email data
    if (
      !body.to ||
      (!body.subject && !body.template) ||
      (!body.html && !body.text && !body.template)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sendEmail(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
