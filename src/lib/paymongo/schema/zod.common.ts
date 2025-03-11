import { z } from "zod";

export const SecretKeySchema = z
  .string()
  .refine((val) => val.startsWith("sk_"), {
    message: "`sk_${string} should start with sk_",
  });
export type SecretKey = z.infer<typeof SecretKeySchema>;

export const PublicKeySchema = z
  .string()
  .refine((val) => val.startsWith("pk_"), {
    message: "`pk_${string} should start with pk_",
  });
export type PublicKey = z.infer<typeof PublicKeySchema>;

export const SecretOrPublicKeySchema = z.union([
  PublicKeySchema,
  SecretKeySchema,
]);

export type SecretOrPublicKey = z.infer<typeof SecretOrPublicKeySchema>;

export type IsSecretKey = z.infer<typeof SecretOrPublicKeySchema>;

export type IsPublicKey = z.infer<typeof SecretOrPublicKeySchema>;

export const MetadataTypeSchema = z.union([z.any(), z.any()]);

export const PaymentMethods = z.union([
  z.literal("gcash"),
  z.literal("card"),
  z.literal("grab_pay"),
  z.literal("paymaya"),
  z.literal("dob"),
  z.literal("dob_ubp"),
  z.literal("brankas_bdo"),
  z.literal("brankas_landbank"),
  z.literal("brankas_metrobank"),
  z.literal("qrph"),
  z.literal("billease"),
]);

export const PaymentMethodTypeList = z.array(PaymentMethods);
export type PaymentMethodType = z.infer<typeof PaymentMethodTypeList>;

export const SpecialPaymentMethods = z.union([
  z.literal("gcash"),
  z.literal("card"),
  z.literal("grab_pay"),
  z.literal("paymaya"),
  z.literal("dob"),
  z.literal("brankas"),
  z.literal("billease"),
]);
export const SpecialPaymentMethodTypeList = z.array(SpecialPaymentMethods);
export type SpecialPaymentMethodType = z.infer<
  typeof SpecialPaymentMethodTypeList
>;

export const RedirectSchema = z.object({
  success: z.string().url(),
  failed: z.string().url(),
});
export type Redirect = z.infer<typeof RedirectSchema>;

export const AllowedPaymentMethodsSchema = z.array(PaymentMethods);
export type AllowedPaymentMethods = z.infer<typeof AllowedPaymentMethodsSchema>;

export const CurrencySchema = z.literal("PHP");

export const ErrorSubCodeSchema = z.union([
  z.literal("card_expired"),
  z.literal("cvc_invalid"),
  z.literal("generic_decline"),
  z.literal("fraudulent"),
  z.literal("insufficient_funds"),
  z.literal("processor_blocked"),
  z.literal("lost_card"),
  z.literal("stolen_card"),
  z.literal("processor_unavailable"),
  z.literal("blocked"),
]);

export const ErrorShapeSchema = z.any();

export const PaymongoErrorSchema = z.any();

export const PaymongoRequestErrorSchema = z.any();

export const BillingSchema = z.any();

export const MetadataSchema = z.record(z.string(), z.any());
export type Metadata = z.infer<typeof MetadataSchema>;

export const TaxSchema = z.object({
  amount: z.number(),
  currency: CurrencySchema,
  inclusive: z.boolean(),
  name: z.string(),
  type: z.string(),
  value: z.string(),
});

export type Tax = z.infer<typeof TaxSchema>;
