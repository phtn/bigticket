## Copperx

#### Checkout Session Response Schema

```json
{
  "id": "518fa184-194b-40f3-9ce8-33fe668305a7",
  "apiVersion": "2023-01-11",
  "created": 1677070414201,
  "object": "checkoutSession",
  "type": "checkout_session.completed",
  "data": {
    "object": {
      "id": "6bce7b07-825f-454e-bea8-3a2bb04a570b",
      "createdAt": "2023-02-22T12:46:11.453Z",
      "updatedAt": "2023-02-22T12:53:34.189Z",
      "mode": "payment",
      "paymentMethodTypes": ["wallet"],
      "paymentSetting": {
        "allowedChains": [
          {
            "chainId": 80001
          }
        ],
        "paymentMethodTypes": null,
        "preferredChainId": 80001
      },
      "expiresAt": "2023-02-22T13:46:11.441Z",
      "customerCreation": "if_required",
      "customerUpdate": null,
      "submitType": "pay",
      "afterCompletion": null,
      "organizationId": "ea2f521c-0f27-48bf-91f7-87dd8de98034",
      "amountTotal": "100000000",
      "currency": "usdc",
      "paymentLinkId": null,
      "subscriptionId": null,
      "customerId": null,
      "clientReferenceId": null,
      "successUrl": "https://copperx.io/success?cid=6bce7b07-825f-454e-bea8-3a2bb04a570b",
      "cancelUrl": null,
      "status": "complete",
      "paymentStatus": "unpaid",
      "metadata": null,
      "emailCollection": false,
      "phoneNumberCollection": false,
      "shippingAddressCollection": false,
      "billingAddressCollection": false,
      "afterCompletionConfirmMsg": null,
      "shippingDetails": {},
      "billingDetails": {},
      "url": "https://buy.copperx.dev/payment/checkout-session/6bce7b07-825f-454e-bea8-3a2bb04a570b"
    }
  }
}
```

### Sample Webhook Payload

```json
{
  "id": "f5cd23ed-8e1a-44b6-9a36-5dadeebf1971",
  "apiVersion": "2023-01-11",
  "created": 1697724495349,
  "object": "subscription",
  // Type will be different based on different webhook types
  "type": "customer.subscription.started",
  "data": {
    "object": {
      "collectionMethod": "charge_automatically",
      "paymentMethodTypes": ["allowance_based_recurring"],
      "id": "ec75bcc9-afdc-4bc5-9cef-5f3fb073cdd0",
      "createdAt": "2023-10-19T14:07:47.149Z",
      "updatedAt": "2023-10-19T14:07:47.740Z",
      "organizationId": "820784c2-7ada-4c8a-adca-b37f0973c067",
      "clientReferenceId": null,
      "currency": "usdc",
      "interval": "month",
      "intervalCount": 1,
      "status": "active",
      "description": null,
      "metadata": {},
      "defaultPaymentMethodId": "b3530e00-1507-4b4d-94c8-45c1227ac8c5",
      "customerId": "293d8bc5-6ba7-4cb7-b99d-2041c7403b46",
      "startDate": "2023-10-19T14:07:47.149Z",
      "endedAt": null,
      "cancelAt": null,
      "canceledAt": null,
      "cancellationReason": null,
      "currentPeriodEnd": "2023-11-19T14:07:47.149Z",
      "currentPeriodStart": "2023-10-19T14:07:47.149Z",
      "cancelAtPeriodEnd": true
    }
  }
}
```

### Handling Webhooks (Copperx)

1. Parse the webhook Payload
2. Identify the event type - use type field to determine the specific subscription event

3. Update subscription status - updat your records from `ts data.object`

4. Trigger actions

### Accepting Crypto payments

```zsh

# Creating a Checkout Session for 1 USDC

curl --request POST \
--url 'https://api.copperx.dev/api/v1/checkout/sessions' \
--header 'Authorization: Bearer {YOUR_API_KEY}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "successUrl": "https://copperx.io/success?cid={CHECKOUT_SESSION_ID}",
    "lineItems": {
        "data": [
            {
                "priceData": {
                    "currency": "usdc",
                    "unitAmount": "100000000",

                        "name": "Basic",
                        "description": "For early stage projects who are getting started"
                    }
                }
            }
        ]
    }
}'

```

### Sample Crypto Checkout Response object

```json
{
  "id": "6bce7b07-825f-454e-bea8-3a2bb04a570b",
  "createdAt": "2023-02-22T12:46:11.453Z",
  "updatedAt": "2023-02-22T12:46:11.553Z",
  "mode": "payment",
  "paymentMethodTypes": ["wallet"],
  "paymentSetting": {
    "allowedChains": [
      {
        "chainId": 80001
      }
    ],
    "paymentMethodTypes": null,
    "preferredChainId": 80001
  },
  "expiresAt": "2023-02-22T13:46:11.441Z",
  "customerCreation": "if_required",
  "customerUpdate": null,
  "submitType": "pay",
  "afterCompletion": null,
  "organizationId": "ea2f521c-0f27-48bf-91f7-87dd8de98034",
  "amountTotal": "100000000",
  "currency": "usdc",
  "paymentLinkId": null,
  "subscriptionId": null,
  "customerId": null,
  "clientReferenceId": null,
  "successUrl": "https://copperx.io/success?cid=6bce7b07-825f-454e-bea8-3a2bb04a570b",
  "cancelUrl": null,
  "status": "open",
  "paymentStatus": "unpaid",
  "metadata": null,
  "emailCollection": false,
  "phoneNumberCollection": false,
  "shippingAddressCollection": false,
  "billingAddressCollection": false,
  "afterCompletionConfirmMsg": null,
  "shippingDetails": {},
  "billingDetails": {},
  "url": "https://buy.copperx.dev/payment/checkout-session/6bce7b07-825f-454e-bea8-3a2bb04a570b",
  "customerDetails": {
    "address": {}
  },
  "lineItems": {
    "object": "list",
    "data": [
      {
        "amountTotal": "100000000",
        "currency": "usdc",
        "description": null,
        "quantity": 1,
        "price": {
          "id": "49da18aa-c09a-4d36-9171-23474685f5bd",
          "createdAt": "2023-02-22T12:46:11.392Z",
          "updatedAt": "2023-02-22T12:46:11.392Z",
          "billingScheme": "per_unit",
          "currency": "usdc",
          "productId": "5a4b57b4-9bff-465e-bf4e-04e4d3659ca3",
          "interval": null,
          "usageType": null,
          "type": "one_time",
          "unitAmount": "100000000",
          "unitAmountDecimal": null,
          "customUnitMax": null,
          "customUnitMin": null,
          "customPreset": null,
          "customUnitAmountSuggestions": null,
          "product": {
            "id": "5a4b57b4-9bff-465e-bf4e-04e4d3659ca3",
            "createdAt": "2023-02-22T12:46:11.380Z",
            "updatedAt": "2023-02-22T12:46:11.420Z",
            "name": "Basic",
            "description": "For early stage projects who are getting started",
            "isActive": true,
            "images": [],
            "unitLabel": null,
            "url": null,
            "metadata": null,
            "defaultPriceId": "49da18aa-c09a-4d36-9171-23474685f5bd",
            "visibility": 10
          },
          "metadata": null,
          "isActive": true,
          "visibility": 20
        }
      }
    ]
  },
  "addresses": [
    {
      "id": "85f8fe19-3465-4201-b2a9-eefce83f1eeb",
      "createdAt": "2023-02-22T12:46:11.553Z",
      "updatedAt": "2023-02-22T12:46:11.553Z",
      "checkoutSessionId": "6bce7b07-825f-454e-bea8-3a2bb04a570b",
      "asset": {
        "id": "a60c79d2-7f9f-4b03-a597-85e7432edb5f",
        "name": "USDC",
        "address": "0x953ecae2e3c8ee8723fef049de53666d7126dde9",
        "chainId": 80001,
        "currency": "usdc",
        "symbol": "USDC",
        "decimals": 6,
        "coingeckoId": "usd-coin",
        "isPublic": true,
        "superToken": {
          "address": "0x6d691bd589cc175714a85bbd528b96c011a24fe6",
          "symbol": "CXUSDCx",
          "decimals": 18
        }
      },
      "paymentAddress": "0x81b63dc0daccee035b186e07356ac53fb1260af4"
    }
  ],
  "paymentIntent": {
    "id": "481d6649-aa07-444a-8fcc-929968514e65",
    "createdAt": "2023-02-22T12:46:11.442Z",
    "updatedAt": "2023-02-22T12:46:11.442Z",
    "organizationId": "ea2f521c-0f27-48bf-91f7-87dd8de98034",
    "amount": "100000000",
    "amountReceived": null,
    "currency": "usdc",
    "status": "requires_payment_method",
    "paymentMethodId": null,
    "paymentMethodTypes": ["wallet"],
    "description": null,
    "transferAccountAddress": null,
    "transactions": []
  }
}
```
