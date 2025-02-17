import { env } from "@/env";
import { Content } from "./content";
interface EventProps {
  params: Promise<{
    id: string;
  }>;
}
const Page = async ({ params }: EventProps) => {
  console.log(env.SMTP_PASSWORD);
  const slug = (await params).id;
  return <Content id={slug} />;
};
export default Page;
