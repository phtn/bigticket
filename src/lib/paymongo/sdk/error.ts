import { type SourceError } from "@/lib/paymongo/schema/zod.source";

interface PaymongoError {
  code: string;
  detail: string;
  source?: SourceError;
}
export function Error(error: PaymongoError) {
  const code = error.code ?? null;
  const detail = error.detail;

  if (error.source !== undefined) {
    return { code, detail, source: error.source };
  }
  return { code, detail };
}
