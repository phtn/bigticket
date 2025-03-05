import { EventEditorContent } from "./content";
import { preloadEventsByHostId } from "@/app/actions";

interface EventEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}
const Page = async ({ params }: EventEditorPageProps) => {
  const { id } = await params;
  const events = await preloadEventsByHostId();
  return <EventEditorContent id={id} events={events} />;
};
export default Page;
