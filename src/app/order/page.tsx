import { Content } from "./content";
import { OrderProvider } from "./ctx";

const Page = async () => (
  <OrderProvider>
    <Content />
  </OrderProvider>
);
export default Page;
