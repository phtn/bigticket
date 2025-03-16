"use client";

import { type CheckoutParams } from "@/lib/paymongo/schema/zod.checkout";

export type PaymentStatus = "success" | "failed" | "pending";
interface ContentProps {
  status: PaymentStatus;
}

export const Content = ({ status }: ContentProps) => {
  return <main>Content = {status}</main>;
};

export const example_cs = {
  id: "cs_xACHk33LHPLnjTBd3TFt8QgL",
  type: "checkout_session",
  attributes: {
    billing: {
      address: {
        city: "Manila",
        country: "PH",
        line1: "123 Main St",
        line2: null,
        postal_code: "12345",
        state: "Metro Manila",
      },
      email: "phtn458@gmail.com",
      name: "Reverse Entropy",
      phone: null,
    },
    billing_information_fields_editable: "enabled",
    cancel_url: null,
    checkout_url:
      "https://checkout.paymongo.com/cs_xACHk33LHPLnjTBd3TFt8QgL_client_2yH2jQu7bJqFyPkQPzQd55kd#cGtfdGVzdF9NNXBLbXZjb2luM0tOc0NicjNLZ2dNVGg=",
    client_key: "cs_xACHk33LHPLnjTBd3TFt8QgL_client_2yH2jQu7bJqFyPkQPzQd55kd",
    customer_email: null,
    description: "bigticket.ph",
    line_items: [
      {
        amount: 30000,
        currency: "PHP",
        description: "Light House marina|>May 1, 2025 6:00 PM|>(Kim Tablizo)",
        images: [],
        name: "M1 Freedom Party 2025",
        quantity: 1,
      },
      {
        amount: 30000,
        currency: "PHP",
        description: "Light House marina|>May 1, 2025 6:00 PM|>(Kim Tablizo)",
        images: [],
        name: "M1 Freedom Party 2025",
        quantity: 1,
      },
      {
        amount: 30000,
        currency: "PHP",
        description: "Light House marina|>May 1, 2025 6:00 PM|>(Kim Tablizo)",
        images: [],
        name: "M1 Freedom Party 2025",
        quantity: 1,
      },
      {
        amount: 30000,
        currency: "PHP",
        description: "Light House marina|>May 1, 2025 6:00 PM|>(Kim Tablizo)",
        images: [],
        name: "M1 Freedom Party 2025",
        quantity: 1,
      },
    ],
    livemode: false,
    merchant: "Big Ticket",
    payments: [],
    payment_intent: {
      id: "pi_jbYmGj7AbY9pE8ZAdgjJyJhH",
      type: "payment_intent",
      attributes: {
        amount: 120000,
        capture_type: "automatic",
        client_key:
          "pi_jbYmGj7AbY9pE8ZAdgjJyJhH_client_C7UMkhTj3APKgeiypccstDSz",
        currency: "PHP",
        description: "bigticket.ph",
        livemode: false,
        original_amount: 120000,
        statement_descriptor: "Reverse Entropy",
        status: "awaiting_payment_method",
        last_payment_error: null,
        payment_method_allowed: [
          "grab_pay",
          "paymaya",
          "brankas",
          "card",
          "gcash",
          "dob",
        ],
        payments: [],
        next_action: null,
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
        metadata: null,
        setup_future_usage: null,
        created_at: 1742085411,
        updated_at: 1742085411,
      },
    },
    payment_method_types: [
      "grab_pay",
      "dob_ubp",
      "brankas_metrobank",
      "gcash",
      "paymaya",
      "brankas_landbank",
      "card",
      "brankas_bdo",
    ],
    reference_number: "B0C42-E5B4T",
    send_email_receipt: true,
    show_description: true,
    show_line_items: true,
    status: "active",
    success_url: null,
    created_at: 1742085411,
    updated_at: 1742085411,
    metadata: null,
  },
};

export const err_params = {
  data: {
    attributes: {
      billing: {
        address: {
          line1: "123 Main St",
          line2: "",
          city: "Manila",
          state: "Metro Manila",
          postal_code: "12345",
          country: "PH",
        },
        name: "",
        email: "",
        phone: "",
      },
      description: "bigticket.ph",
      line_items: [
        {
          amount: 30000,
          currency: "PHP",
          description: "Light House marina|>May 1, 2025 6:00 PM|>(Kim Tablizo)",
          name: "M1 Freedom Party 2025",
          quantity: 3,
        },
      ],
      payment_method_types: [
        "gcash",
        "card",
        "grab_pay",
        "paymaya",
        "dob_ubp",
        "brankas_bdo",
        "brankas_metrobank",
        "brankas_landbank",
      ],
      reference_number: "B8E11-12ABT",
      send_email_receipt: true,
      show_description: true,
      show_line_items: true,
      statement_descriptor: "Reverse Entropy",
    },
  },
} satisfies CheckoutParams;
