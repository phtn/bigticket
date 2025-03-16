import { env } from "@/env";
import { Content } from "./content";
const Page = async () => {
  const prod = env.NODE_ENV === "production";
  return <Content node_env={prod} />;
};

export default Page;
