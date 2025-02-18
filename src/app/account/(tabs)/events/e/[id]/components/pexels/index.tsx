import { Sidebar } from "@/app/_components_/sidebar";
import { ListTitle } from "@/app/_components_/sidebar/components";
import { PexelParamList } from "./pexels";

export const ImageQuery = ({ category }: { category: string | undefined }) => {
  return (
    <Sidebar className="-mt-4 md:-mt-3 md:ml-5">
      <section className="relative h-fit w-full rounded-md border-[0.33px] border-primary-100 bg-chalk/80 px-2 py-3 shadow-lg backdrop-blur-2xl">
        <ListTitle title="Generate Images" />
        <PexelParamList category={category} />
      </section>
    </Sidebar>
  );
};
