import { describe, test, expect, beforeEach, mock } from "bun:test";
import { POST } from "@/app/api/payments/route";
import * as crypto from "crypto";

// Mock environment variable
const TEST_WEBHOOK_SECRET = "whsk_YYCcD6QzDqViMWKroTFxSXNt";
const TIMESTAMP = "1496734173";

mock.module("@/env", () => ({
  env: {
    PAYMONGO_WHSK: TEST_WEBHOOK_SECRET,
  },
}));

// Mock crypto
let mockHmac: any;

function computeHmacSignature(
  timestamp: string,
  payload: string,
  secret: string,
): string {
  // Simulate PayMongo's HMAC signature computation
  // In reality, PayMongo uses: HMAC_SHA256(TIMESTAMP + '.' + payload, secret)
  return crypto
    .createHmac("sha256", secret)
    .update(timestamp + "." + payload)
    .digest("hex");
}

beforeEach(() => {
  // Create a real HMAC instance for consistent behavior
  const realHmac = crypto.createHmac("sha256", TEST_WEBHOOK_SECRET);

  mockHmac = {
    update: mock((data: string) => {
      mockHmac._lastData = data;
      realHmac.update(data);
      return mockHmac;
    }),
    digest: mock((format: string) => {
      if (mockHmac._lastData && format === "hex") {
        return realHmac.digest("hex");
      }
      return "invalid";
    }),
    _lastData: null,
  };

  mock.module("crypto", () => ({
    createHmac: mock(() => mockHmac),
  }));
});

const originalCrypto = { ...crypto };

describe("Payments Webhook", () => {
  let mockHeaders: Map<string, string>;
  let mockRequest: any;
  let mockBodyReader: any;

  beforeEach(() => {
    // Clear all mocks
    mock.restore();

    // Setup crypto mock after restoration
    mock.module("crypto", () => ({
      ...originalCrypto,
      createHmac: mock(() => mockHmac),
    }));

    // Reset test-specific mocks
    mockHeaders = new Map();
    mockBodyReader = {
      read: mock(() => ({ done: true, value: new Uint8Array() })),
    };

    mockRequest = {
      headers: {
        get: mock((key: string) => mockHeaders.get(key)),
      },
      body: {
        getReader: mock(() => mockBodyReader),
      },
    };
  });

  describe("POST handler", () => {
    test("returns 400 when Paymongo-Signature header is missing", async () => {
      const response = await POST(mockRequest as any);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Missing Paymongo-Signature header");
    });

    test("returns 400 when signature is invalid", async () => {
      // Configure mocks for invalid signature
      mockHeaders.set(
        "paymongo-signature",
        `t=${TIMESTAMP},te=invalid_signature,li=invalid_signature`,
      );
      mockBodyReader.read = mock(() => ({
        done: true,
        value: new TextEncoder().encode(EVT),
      }));

      // Mock the verification to fail
      mockHmac.digest = mock(() => "different_hash");

      const response = await POST(mockRequest as any);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Invalid signature");
    });

    test("successfully processes valid webhook with correct signature", async () => {
      const signature = computeHmacSignature(
        TIMESTAMP,
        EVT,
        TEST_WEBHOOK_SECRET,
      );

      console.log("SIGNATURE", signature);

      // Configure mocks for valid request
      mockHeaders.set(
        "paymongo-signature",
        `t=${TIMESTAMP},te=${signature},li=different_hash`,
      );
      mockBodyReader.read = mock(() => ({
        done: true,
        value: new TextEncoder().encode(EVT),
      }));

      const response = await POST(mockRequest as any);
      const body = await response.json();

      console.log("RESPONSE", response);

      expect(response.status).toBe(200);
      expect(body.received).toBe(true);
      expect(mockHmac.update).toHaveBeenCalledWith(`${TIMESTAMP}.${EVT}`);
    });

    test("returns 400 when payload is not valid JSON", async () => {
      const TIMESTAMP = "TIMESTAMP";
      const invalidJson = '{"broken JSON}';

      // Configure mocks for invalid JSON
      mockHeaders.set(
        "paymongo-signature",
        `t=${TIMESTAMP},te=valid_signature_hash,li=different_hash`,
      );
      mockBodyReader.read = mock(() => ({
        done: true,
        value: new TextEncoder().encode(invalidJson),
      }));

      const response = await POST(mockRequest as any);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toContain("Unexpected token");
      expect(mockHmac.update).toHaveBeenCalledWith(
        `${TIMESTAMP}.${invalidJson}`,
      );
    });
  });

  describe("Buffer function", () => {
    test("reads request body as buffer with multiple chunks", async () => {
      // Setup mock reader to return multiple chunks
      let callCount = 0;
      const TIMESTAMP = "TIMESTAMP";
      const chunk1 = new TextEncoder().encode('{"data":{"type":"test"');
      const chunk2 = new TextEncoder().encode(',"id":"123"}}');
      const fullPayload = '{"data":{"type":"test","id":"123"}}';
      const signature = computeHmacSignature(
        TIMESTAMP,
        fullPayload,
        TEST_WEBHOOK_SECRET,
      );

      mockBodyReader.read = mock(() => {
        callCount++;
        if (callCount === 1) return { done: false, value: chunk1 };
        if (callCount === 2) return { done: false, value: chunk2 };
        return { done: true, value: undefined };
      });

      mockHeaders.set(
        "paymongo-signature",
        `t=${TIMESTAMP},te=${signature},li=different_hash`,
      );

      const response = await POST(mockRequest as any);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.received).toBe(true);
      expect(callCount).toBe(3); // Ensure all chunks were read
      expect(mockHmac.update).toHaveBeenCalledWith(
        `${TIMESTAMP}.${fullPayload}`,
      );
    });

    test("handles case when request body is empty", async () => {
      mockHeaders.set(
        "paymongo-signature",
        "t=TIMESTAMP,te=valid_signature_hash,li=valid_signature_hash",
      );
      mockRequest.body = null;

      // Mock signature verification to succeed with empty payload
      mockHmac.digest = mock(() => "valid_signature_hash");

      const response = await POST(mockRequest as any);

      expect(response.status).toBe(400);
    });
  });

  describe("Signature verification", () => {
    test("validates test mode signature", async () => {
      const signature = computeHmacSignature(
        TIMESTAMP,
        EVT,
        TEST_WEBHOOK_SECRET,
      );

      mockHeaders.set(
        "paymongo-signature",
        `t=${TIMESTAMP},te=${signature},li=different_hash`,
      );
      mockBodyReader.read = mock(() => ({
        done: true,
        value: new TextEncoder().encode(EVT),
      }));

      const response = await POST(mockRequest as any);

      expect(response.status).toBe(200);
      expect(mockHmac.update).toHaveBeenCalledWith(`${TIMESTAMP}.${EVT}`);
    });

    test("validates live mode signature", async () => {
      const payload = EVT;
      const signature = computeHmacSignature(
        TIMESTAMP,
        payload,
        TEST_WEBHOOK_SECRET,
      );

      mockHeaders.set(
        "paymongo-signature",
        `t=${TIMESTAMP},te=different_hash,li=${signature}`,
      );
      mockBodyReader.read = mock(() => ({
        done: true,
        value: new TextEncoder().encode(payload),
      }));

      const response = await POST(mockRequest as any);

      expect(response.status).toBe(200);
    });

    test("rejects when TIMESTAMP is missing", async () => {
      mockHeaders.set(
        "paymongo-signature",
        "te=valid_signature_hash,li=valid_signature_hash",
      );
      mockBodyReader.read = mock(() => ({
        done: true,
        value: new TextEncoder().encode(EVT),
      }));

      const response = await POST(mockRequest as any);

      expect(response.status).toBe(400);
    });
  });
});

const resource = {
  data: {
    id: "evt_41waYXad8VuenT671SucbQJF",
    type: "event",
    attributes: {
      type: "checkout_session.payment.paid",
      livemode: true,
      data: {
        id: "src_wZ8pJPV6tL4Dwfq8YgaXMKAR",
        type: "checkout_session",
        attributes: {
          amount: 10000,
          billing: {
            address: {
              city: "Taguig",
              country: "PH",
              line1: "9th Avenue and 26th Street, Unit 3308",
              line2: "High Street South Corporate Plaza Tower 2",
              postal_code: "1634",
              state: "Metro Manila",
            },
            email: "trizleon@paymongo.com",
            name: "Triz Leon",
            phone: "09168268582",
          },
          currency: "PHP",
          livemode: true,
          redirect: {
            checkout_url: "https://someurl",
            failed: "https://links.staging.paymongo.dev/gcash/failed",
            success: "https://links.staging.paymongo.dev/gcash/success",
          },
          status: "paid",
          type: "gcash",
          created_at: TIMESTAMP,
        },
      },
      previous_data: {},
      pending_webhooks: 0,
      created_at: TIMESTAMP,
      updated_at: TIMESTAMP,
    },
  },
};

const EVT = JSON.stringify(resource);
