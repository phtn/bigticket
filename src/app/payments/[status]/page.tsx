import { type PaymentStatus } from "@/lib/paymongo/schema/zod.payments";
import { Content } from "./content";

interface PaymentsPageProps {
  params: {
    status: PaymentStatus & "cancelled";
  };
}

const Page = async ({ params }: PaymentsPageProps) => {
  return <Content {...params} />;
};
export default Page;
