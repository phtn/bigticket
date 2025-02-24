import { EventEditorContent } from "./content";
import { getAccountID, preloadEventsByHostId } from "@/app/actions";

interface EventEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}
const Page = async ({ params }: EventEditorPageProps) => {
  const { id } = await params;
  console.log(id);
  const host_id = await getAccountID();
  const events = await preloadEventsByHostId(host_id);
  return <EventEditorContent id={id} events={events} />;
};
export default Page;
