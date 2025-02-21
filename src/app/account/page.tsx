import { Content } from "./content";
import { getAccountID, preloadEventsByHostId } from "../actions";

export interface PageProps {
  params: Promise<{
    id: string | undefined;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const host_id = await getAccountID();
  const events = await preloadEventsByHostId(host_id);
  return <Content id={id} events={events} />;
};
export default Page;
