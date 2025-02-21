import { Content } from "./content";
import { preloadAllEvents } from "@/app/actions";

export interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const events = await preloadAllEvents();
  return <Content slug={slug} events={events} />;
};
export default Page;
