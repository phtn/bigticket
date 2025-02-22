import { preloadAllEvents } from "@/app/actions";
import { EVContent } from "./content";

const Page = async () => {
  const preloadedEvents = await preloadAllEvents();
  return <EVContent preloadedEvents={preloadedEvents} />;
};

export default Page;
