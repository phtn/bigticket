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

export interface Charge {
  brand_color: string;
  brand_logo_url: string;
  charge_kind: string;
  code: string;
  collected_email: boolean;
  created_at: string;
  expires_at: string;
  hosted_url: string;
  id: string;
  metadata: Record<string, string>;
  ocs_points_override: boolean;
  organization_name: string;
  payments: string[];
  pricing: {
    local: {
      amount: string;
      currency: string;
    };
    settlement: {
      amount: string;
      currency: string;
    };
  };
  pricing_type: "fixed_price" | "no_price";
  pwcb_only: boolean;
  redirects: {
    cancel_url: string;
    success_url: string;
    will_redirect_after_success: boolean;
  };
  support_email: string;
  timeline: [
    {
      status: string;
      time: string;
    },
  ];
  web3_data: {
    transfer_intent: string | null;
    success_events: string[];
    failure_events: string[];
    contract_addresses: Record<string, string>;
    settlement_currency_addresses: Record<string, string>;
    subsidized_payments_chain_to_tokens: {
      137: {
        token_addresses: string[];
      };
      1: { token_addresses: string[] };
      8453: {
        token_addresses: string[];
      };
    };
    contract_caller_request_id: string;
  };
  web3_retail_payment_metadata: {
    quote_id: string;
    source_amount: { amount: null; currency: null };
    exchange_rate_with_spread: { amount: null; currency: null };
    exchange_rate_without_spread: { amount: null; currency: null };
    max_retail_payment_value_usd: number;
    fees: [];
    high_value_payment_currencies: string[];
  };
  web3_retail_payments_enabled: boolean;
  warnings?: string[];
}
