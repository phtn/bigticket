import { preloadAllEvents } from "@/app/actions";
import { EVContent } from "./content";

const Page = async () => {
  const events = await preloadAllEvents();
  return <EVContent events={events} />;
};

export default Page;
