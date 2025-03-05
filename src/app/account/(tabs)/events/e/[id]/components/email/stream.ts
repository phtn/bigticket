export type Status =
  | "connection"
  | "validation"
  | "rendering"
  | "sending"
  | "complete"
  | "error";

export interface EmailStatus {
  type: Status;
  message: string;
  details?: unknown;
}

export function createEmailStream() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const send = async (status: EmailStatus) => {
    const data = `data: ${JSON.stringify(status)}\n\n`;
    await writer.write(encoder.encode(data));
  };

  return { stream: stream.readable, send, writer };
}
