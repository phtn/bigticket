import { useToggle } from "@/hooks/useToggle";
import { Icon } from "@/icons";
import { SideVaul } from "@/ui/vaul";
import { FlatWindow } from "@/ui/window";
import { Button } from "@nextui-org/react";

interface CreateNewEventProps {
  pathname: string;
  account_id: string | undefined;
}
export const CreateNewEvent = ({
  pathname,
  account_id,
}: CreateNewEventProps) => {
  const { open, toggle } = useToggle();
  return (
    <div className="flex h-10 w-full items-center justify-end xl:space-x-1">
      <Button
        href={`${pathname}/edit?page=${account_id}`}
        size="md"
        className="hidden lg:flex"
        variant="shadow"
        color="secondary"
        onPress={toggle}
      >
        <Icon name="Plus" className="size-4" />
        <span className="font-inter text-xs font-medium tracking-tighter">
          Create an event
        </span>
      </Button>
      <SideVaul
        open={open}
        onOpenChange={toggle}
        direction="right"
        title={"Title"}
        description={"Description"}
      >
        <FlatWindow
          // icon={"InfoLine"}
          title={"Create New Event"}
          variant="god"
          className={
            "bg-gradient-to-br from-orange-50 via-orange-50 to-lime-50"
          }
        >
          <div className="size-full bg-white">
            <div className="flex h-full overflow-scroll bg-white py-6 md:h-[calc(85vh)] md:w-[calc(39vw)] md:px-6">
              <article className="space-y-10">
                <section className="flex items-center gap-2">
                  {["tag"]?.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-full bg-shade/60 px-3 py-1 text-xs hover:bg-gray-100"
                    >
                      {tag}
                    </div>
                  ))}
                </section>
                <h1 className="font-sans text-3xl font-bold tracking-tighter sm:text-5xl">
                  {"Event Title"}
                </h1>
                <div className="flex items-center gap-3">{"host id"}</div>
                <div className="space-y-6 text-lg">
                  <p className="font-bold text-darkarmy">{"Description"}</p>
                  FORM
                </div>
              </article>
            </div>
          </div>
        </FlatWindow>
      </SideVaul>
    </div>
  );
};
