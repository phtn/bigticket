import { Content } from "./content";
import { preloadAllEvents } from "@/app/actions";

const Page = async () => {
  const preloadedEvents = await preloadAllEvents();
  return <Content preloadedEvents={preloadedEvents} />;
};
export default Page;
