import { z } from "zod";

export const CustomerResourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  attributes: z.object({
    default_device: z.string(),
    default_payment_method_id: z.string().nullable(),
    email: z.string(),
    first_name: z.string(),
    has_vaulted_payment_methods: z.boolean(),
    last_name: z.string(),
    livemode: z.boolean(),
    organization_id: z.string().optional(),
    phone: z.string(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
});
export type CustomerResource = z.infer<typeof CustomerResourceSchema>;

export const CustomerPaymentMethodResource = z.object({
  has_more: z.boolean(),
  data: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      attributes: z.object({
        customer_id: z.string(),
        livemode: z.boolean(),
        organization_id: z.string(),
        payment_method_id: z.string(),
        payment_method_type: z.string(),
        session_type: z.string(),
        created_at: z.number(),
        updated_at: z.number(),
      }),
    }),
  ),
});
export type CustomerPaymentMethodResource = z.infer<
  typeof CustomerPaymentMethodResource
>;

export const CreateCustomerParamsSchema = z.object({
  data: z.object({
    attributes: z.object({
      default_device: z.string(),
      default_payment_method_id: z.null(),
      email: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      phone: z.string().nullable(), // +6309156984242
      created_at: z.number(),
      updated_at: z.number(),
    }),
  }),
});
export type CreateCustomerParams = z.infer<typeof CreateCustomerParamsSchema>;

export const RetrieveCustomerParamsSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
});
export type RetrieveCustomerParams = z.infer<
  typeof RetrieveCustomerParamsSchema
>;

export const EditCustomerParamsSchema = z.object({
  id: z.string(),
  data: z.object({
    attributes: z.object({
      first_name: z.string(),
      last_name: z.string(),
      phone: z.string(),
      email: z.string(),
      default_device: z.string(),
    }),
  }),
});
export type EditCustomerParams = z.infer<typeof EditCustomerParamsSchema>;

export const custResource = {
  id: "cus_b9ENKVqcHBfQQmv26uDYDCsD",
  type: "customer",
  attributes: {
    default_device: "phone",
    default_payment_method_id: null,
    email: "CarolBerge@mail.com",
    first_name: "Lilly",
    last_name: "McClure",
    livemode: false,
    organization_id: "org_hwqYTbRCnV9W5MwyS6BhaLuh",
    phone: "+633359544302",
    created_at: 1657187414,
    updated_at: 1657187414,
  },
};

export const DeleteCustomerParamsSchema = z.object({
  id: z.string(),
});
export type DeleteCustomerParams = z.infer<typeof DeleteCustomerParamsSchema>;

export interface Data {
  id: string;
  type: string;
  attributes: Attributes;
}
export interface Attributes {
  default_device: string;
  default_payment_method_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  livemode: boolean;
  organization_id: string;
  phone: string;
  created_at: number;
  updated_at: number;
}
