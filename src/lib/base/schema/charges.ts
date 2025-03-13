import { z } from "zod";

export const CreateChargeParamsSchema = z.object({
  local_price: z.object({
    amount: z.string().min(1),
    currency: z.string().min(3).max(6),
  }),
  pricing_type: z.enum(["fixed_price", "no_price"]),
  metadata: z.record(z.string().max(255)),
});

export type CreateChargeParams = z.infer<typeof CreateChargeParamsSchema>;

export const GetChargeParamsSchema = z.object({
  chargeId: z.string(),
});

export type GetChargeParams = z.infer<typeof GetChargeParamsSchema>;

export const example_response_data = {
  brand_color: "#122332",
  brand_logo_url: "",
  charge_kind: "WEB3",
  code: "2V8VZH3Q",
  collected_email: false,
  created_at: "2025-03-13T16:40:37Z",
  expires_at: "2025-03-15T16:40:37Z",
  hosted_url:
    "https://commerce.coinbase.com/pay/f3bae362-7634-4611-a29c-887af215ec41",
  id: "f3bae362-7634-4611-a29c-887af215ec41",
  metadata: {},
  ocs_points_override: false,
  organization_name: "",
  payments: [],
  pricing: {
    local: {
      amount: "0",
      currency: "USDC",
    },
    settlement: {
      amount: "0",
      currency: "USDC",
    },
  },
  pricing_type: "no_price",
  pwcb_only: false,
  redirects: {
    cancel_url: "",
    success_url: "",
    will_redirect_after_success: false,
  },
  support_email: "hq@bigticket.ph",
  timeline: [
    {
      status: "NEW",
      time: "2025-03-13T16:40:37Z",
    },
  ],
  web3_data: {
    transfer_intent: null,
    success_events: [],
    failure_events: [],
    contract_addresses: {
      "137": "0x288844216a63638381784E0C1081A3826fD5a2E4",
      "1": "0x1FA57f879417e029Ef57D7Ce915b0aA56A507C31",
      "8453": "0x03059433BCdB6144624cC2443159D9445C32b7a8",
    },
    settlement_currency_addresses: {
      "137": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    subsidized_payments_chain_to_tokens: {
      "137": {
        token_addresses: ["0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"],
      },
      "1": { token_addresses: [""] },
      "8453": {
        token_addresses: ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
      },
    },
    contract_caller_request_id: "",
  },
  web3_retail_payment_metadata: {
    quote_id: "",
    source_amount: { amount: null, currency: null },
    exchange_rate_with_spread: { amount: null, currency: null },
    exchange_rate_without_spread: { amount: null, currency: null },
    max_retail_payment_value_usd: 10000,
    fees: [],
    high_value_payment_currencies: ["usdc", "btc", "eth", "sol", "xrp"],
  },
  web3_retail_payments_enabled: true,
  warnings: [
    "Missing X-CC-Version header; serving latest API version (2018-03-22)",
  ],
};
