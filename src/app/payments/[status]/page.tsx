import { type PaymentStatus } from "@/lib/paymongo/schema/zod.payments";
import { Content } from "./content";

interface PaymentsPageProps {
  params: Promise<{
    status: PaymentStatus & "cancelled";
  }>;
}

const Page = async ({ params }: PaymentsPageProps) => {
  const { status } = await params;
  return <Content status={status} />;
};
export default Page;
