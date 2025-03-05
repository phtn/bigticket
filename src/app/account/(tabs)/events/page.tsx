import { Content } from "./content";
import { preloadEventsByHostId } from "@/app/actions";

export interface PageProps {
  params: Promise<{
    id: string | undefined;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const events = await preloadEventsByHostId();
  return <Content id={id} events={events} />;
};
export default Page;
