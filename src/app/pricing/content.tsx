"use client";

import { PricingCard } from "./components";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "month",
    label: "Current Plan",
    features: ["Host private events", "Email support", "Unlimited events"],
  },
  {
    name: "Pro",
    price: 40,
    period: "monthly",
    label: "Get Pro",
    featured: true,
    features: [
      "Host public events",
      "Sell event tickets",
      "Real-time data tracking",
      "Everything in Hobby Plan",
    ],
  },
  {
    name: "Enterprise",
    price: 120,
    period: "year",
    label: "Get Enterprise",
    features: [
      "Unlimited data storage",
      "Customizable dashboards",
      "Advanced data segmentation",
      "Real-time data processing",
      "AI-powered insights and recommendations",
      "Everything in Hobby Plan",
      "Everything in Pro Plan",
    ],
  },
];
export const Content = () => {
  return (
    <main>
      <div className="h-full bg-void px-4 py-20 text-white md:h-[calc(100vh-64px)]">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">
              Host events like a
              <span className="ml-3 rounded-lg bg-peach px-2 md:rounded-xl">
                Pro
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-gray-400">
              Our pricing is designed for advanced events hosting features and
              more flexibility.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
