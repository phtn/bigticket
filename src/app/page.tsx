import { fetchQuery } from "convex/nextjs";
import { api } from "@vx/api";
import { Content } from "./content";

export interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const Page = async ({ params }: PageProps) => {
  const events = await fetchQuery(api.events.get.all);
  const { slug } = await params;
  return <Content slug={slug} preloaded={events} />;
};
export default Page;
