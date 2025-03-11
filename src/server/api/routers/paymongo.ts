import { router, proc } from "../trpc";
import { env } from "@/env";
import {
  CheckoutParamsSchema,
  ExpireCheckoutParamsSchema,
  RetrieveCheckoutParamsSchema,
} from "@/lib/paymongo/schema/zod.checkout";
import {
  CreateCustomerParamsSchema,
  EditCustomerParamsSchema,
  RetrieveCustomerParamsSchema,
} from "@/lib/paymongo/schema/zod.customer";
import { Paymongo } from "@/lib/paymongo/sdk";
import { asyncR } from "@/lib/paymongo/utils";

const pay = Paymongo(env.PAYMONGO_SK);

const createCheckout = proc.input(CheckoutParamsSchema);
const retrieveCheckout = proc.input(RetrieveCheckoutParamsSchema);
const expireCheckout = proc.input(ExpireCheckoutParamsSchema);
//
const createCustomer = proc.input(CreateCustomerParamsSchema);
const retrieveCustomer = proc.input(RetrieveCustomerParamsSchema);
const editCustomer = proc.input(EditCustomerParamsSchema);

export const paymongo = router({
  createCheckout: createCheckout.mutation(asyncR(pay.checkout.create)),
  retrieveCheckout: retrieveCheckout.query(asyncR(pay.checkout.retrieve)),
  expireCheckout: expireCheckout.mutation(asyncR(pay.checkout.expire)),
  //
  createCustomer: createCustomer.mutation(asyncR(pay.customer.create)),
  retrieveCustomer: retrieveCustomer.query(asyncR(pay.customer.retrieve)),
  editCustomer: editCustomer.mutation(asyncR(pay.customer.edit)),
});
