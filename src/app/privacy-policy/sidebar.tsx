import { cn } from "@/lib/utils";
import {
  Brand,
  BrandName,
  TicketsMono,
  TitleMono,
} from "../_components/navbar.tsx/brand";
import { type Section } from "./content";
import { HyperList } from "@/ui/list";
import { Icon } from "@/icons";
import { Button } from "@nextui-org/react";

interface SidebarProps {
  sections: Section[];
  isOpen: boolean;
  toggleFn: VoidFunction;
}

export const Sidebar = ({ sections, isOpen, toggleFn }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 w-fit text-chalk transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="bg-coal p-2">
        <Brand className={"bg-coal"}>
          <BrandName>
            <TicketsMono />
            <TitleMono />
          </BrandName>
          <Button
            size="sm"
            radius="lg"
            isIconOnly
            variant="light"
            onPress={toggleFn}
          >
            <Icon name="LeftChev" className="size-4" />
          </Button>
        </Brand>
      </div>
      <div className="h-[calc(100vh-9vh)] space-y-4 overflow-y-auto bg-coal p-6">
        <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
        <nav className="space-y-1">
          <HyperList data={sections} component={SectionItem} keyId="keyId" />
        </nav>
        <div className="flex h-[22vh] w-full items-end gap-0.5 text-xs text-primary-400">
          <p className="font-bold">BigTicket</p>
          <p>&copy;</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>
    </aside>
  );
};

const SectionItem = (section: Section) => (
  <a
    key={section.id}
    href={`#${section.id}`}
    className="flex space-x-4 rounded-xl p-2 text-sm text-primary-300 transition-colors duration-300 hover:bg-void"
  >
    <div className="relative flex size-8 items-center justify-center">
      <Icon
        name="Squircle"
        className="absolute size-8 text-indigo-100 opacity-10"
      />
      <p className="absolute font-bold">{section.keyId + 1}</p>
    </div>
    <div className="flex items-center font-medium">{section.title}</div>
  </a>
);
