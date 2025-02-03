import { Content } from "./content";
interface EventProps {
  params: Promise<{
    id: string;
  }>;
}
const Page = async ({ params }: EventProps) => {
  const slug = (await params).id;
  return <Content id={slug} />;
};
export default Page;
