import { fetchMutation } from "convex/nextjs";
import { Content } from "./content";
import { api } from "@vx/api";
import { getUserID } from "@/app/actions";

export interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const Page = async ({ params }: PageProps) => {
  const host_id = await getUserID();
  const events = await fetchMutation(api.events.get.byHostId, {
    host_id: host_id!,
  });
  console.log(events);
  const { slug } = await params;
  return <Content slug={slug} preloaded={events} />;
};
export default Page;
