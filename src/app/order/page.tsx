import { env } from "@/env";
import { Content } from "./content";
import { DynamicProxima } from "../_components_/proxima";
const Page = async () => {
  const prod = env.NODE_ENV === "production";
  return (
    <main className="space-y-24">
      <Content node_env={prod} />
      <DynamicProxima className="text-primary" />
    </main>
  );
};

export default Page;
