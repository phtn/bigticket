import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/env";

const WHSK = env.PAYMONGO_WHSK;

interface WebhookEvent {
  data: {
    id: string;
    type: string;
    attributes: Record<string, unknown>;
  };
}

interface SignatureComponents {
  timestamp: string | undefined;
  testModeSignature: string | undefined;
  liveModeSignature: string | undefined;
}

async function buffer(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.from([]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

function parseSignature(signature: string): SignatureComponents {
  const [t, te, li] = signature.split(",");
  return {
    timestamp: t?.split("=")[1],
    testModeSignature: te?.split("=")[1],
    liveModeSignature: li?.split("=")[1],
  };
}

function verifySignature(
  components: SignatureComponents,
  payload: string,
  webhookSecret: string,
): boolean {
  const { timestamp, testModeSignature, liveModeSignature } = components;

  if (!timestamp) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return (
    testModeSignature === expectedSignature ||
    liveModeSignature === expectedSignature
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get("paymongo-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Paymongo-Signature header" },
      { status: 400 },
    );
  }

  const signatureComponents = parseSignature(signature);
  const rawBody = await buffer(req);
  const payload = rawBody.toString();

  const isValid = verifySignature(signatureComponents, payload, WHSK);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(payload) as WebhookEvent;
    console.log("Webhook received:", event);

    return NextResponse.json({
      data: event,
      message: "webhook received",
      status: 200,
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json(
      {
        error: `Webhook error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 400 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
