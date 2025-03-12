import { Content, type PaymentStatus } from "./content";
interface PaymentStatusProps {
  params: Promise<{
    status: PaymentStatus;
  }>;
}

const Page = async ({ params }: PaymentStatusProps) => {
  const { status } = await params;
  return <Content status={status} />;
};
export default Page;
