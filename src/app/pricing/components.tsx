"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Iconx } from "@/icons/icon";
import { FloatingVaul } from "@/ui/vaul";
import { Image, Radio, RadioGroup } from "@nextui-org/react";

interface PricingCardProps {
  name: string;
  price: number;
  label: string;
  period: string;
  features: string[];
  featured?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  label,
  features,
  featured,
}: PricingCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative rounded-lg border border-zinc-800 bg-zinc-700 p-6",
          { "border-2 border-teal-400 bg-zinc-500": name === "Free" },
        )}
      >
        {featured && (
          <div className="absolute -top-2 right-4 flex space-x-1 rounded-full bg-white px-3 py-1 text-sm font-medium tracking-tight text-black">
            <span>Featured</span>
            <Iconx name="energy" className="size-5 text-peach" />
          </div>
        )}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white">{name}</h3>
            <div className="mt-2 flex items-baseline font-inter">
              <span className="text-5xl font-medium tracking-tight text-white">
                ₱{price}
              </span>
              <span className="ml-1 text-sm font-medium text-zinc-400">
                /{period}
              </span>
            </div>
          </div>
          <Button
            className="w-full bg-teal-600 hover:bg-secondary"
            onClick={() => setShowPaymentModal(true)}
          >
            {label}
          </Button>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Iconx name="check" className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={{ name, price, period }}
      />
    </>
  );
}

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "paypal",
    name: "PayPal",
    logo: "/placeholder.svg?height=40&width=120",
    description: "Pay with your PayPal account",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "/placeholder.svg?height=40&width=120",
    description: "Pay with credit card",
  },
  {
    id: "mollie",
    name: "Mollie",
    logo: "/placeholder.svg?height=40&width=120",
    description: "Pay with European payment methods",
  },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    period: string;
  };
}

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("stripe");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulated payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  return (
    <FloatingVaul open={isOpen} onOpenChange={onClose}>
      <div>
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-medium text-zinc-400">
                Selected plan
              </h3>
              <div className="text-right">
                <div className="text-sm font-medium">{plan.name}</div>
                <div className="font-inter text-2xl font-medium">
                  ₱{plan.price}
                  <span className="text-sm text-zinc-400">/{plan.period}</span>
                </div>
              </div>
            </div>
            <RadioGroup
              value={selectedMethod}
              onValueChange={setSelectedMethod}
              className="grid gap-4"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors",
                    selectedMethod === method.id
                      ? "border-blue-600 bg-blue-600/10"
                      : "border-zinc-800 hover:border-zinc-700",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Radio value={method.id} className="border-zinc-700" />
                    <div className="space-y-1">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-zinc-400">
                        {method.description}
                      </div>
                    </div>
                  </div>
                  <div className="relative h-8 w-20">
                    <Image
                      src={method.logo || "/placeholder.svg"}
                      alt={method.name}
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue to payment"}
          </Button>
        </div>
      </div>
    </FloatingVaul>
  );

  // return (
  // <Dialog open={isOpen} onOpenChange={onClose}>
  //   <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white p-0">
  //     <DialogHeader className="p-6 border-b border-zinc-800">
  //       <DialogTitle className="text-xl font-medium">Choose payment method</DialogTitle>
  //     </DialogHeader>
  //     <div className="p-6 space-y-6">
  //       <div className="space-y-4">
  //         <div className="flex items-baseline justify-between">
  //           <h3 className="text-sm font-medium text-zinc-400">Selected plan</h3>
  //           <div className="text-right">
  //             <div className="text-sm font-medium">{plan.name}</div>
  //             <div className="text-2xl font-bold">
  //               €{plan.price}
  //               <span className="text-sm text-zinc-400">/{plan.period}</span>
  //             </div>
  //           </div>
  //         </div>
  //         <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="grid gap-4">
  //           {paymentMethods.map((method) => (
  //             <Label
  //               key={method.id}
  //               className={cn(
  //                 "flex items-center justify-between px-4 py-3 border rounded-lg cursor-pointer transition-colors",
  //                 selectedMethod === method.id
  //                   ? "border-blue-600 bg-blue-600/10"
  //                   : "border-zinc-800 hover:border-zinc-700",
  //               )}
  //             >
  //               <div className="flex items-center gap-4">
  //                 <RadioGroupItem value={method.id} className="border-zinc-700" />
  //                 <div className="space-y-1">
  //                   <div className="font-medium">{method.name}</div>
  //                   <div className="text-sm text-zinc-400">{method.description}</div>
  //                 </div>
  //               </div>
  //               <div className="h-8 w-20 relative">
  //                 <Image src={method.logo || "/placeholder.svg"} alt={method.name} fill className="object-contain" />
  //               </div>
  //             </Label>
  //           ))}
  //         </RadioGroup>
  //       </div>
  //       <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isLoading}>
  //         {isLoading ? "Processing..." : "Continue to payment"}
  //       </Button>
  //     </div>
  //   </DialogContent>
  // </Dialog>
  // )
}
