import { Sidebar } from "@/app/_components/sidebar";
import { ListTitle } from "@/app/_components/sidebar/components";
import { PexelParamList } from "@/app/e/[id]/components/pexels/pexels";

export const ImageQuery = () => {
  return (
    <Sidebar className="-mt-4">
      <section className="relative h-fit w-full rounded-xl border-[0.33px] border-primary-100 bg-chalk/80 px-2 py-3 shadow-lg backdrop-blur-2xl">
        <ListTitle title="Generate Images" />
        <PexelParamList />
      </section>
    </Sidebar>
  );
};
