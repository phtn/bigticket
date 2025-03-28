import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import Link from "next/link";
import { Brand, BrandName, TicketsMono, TitleMono } from "../navbar/brand";
import type { TocProps, Section, FooterProps } from "./types";
import { Iconx } from "@/icons";
import { BtnIcon } from "@/ui/button/button-icon";

export const Toc = ({ sections, isOpen, toggleFn, footer }: TocProps) => {
  return (
    <div
      className={cn(
        "fixed z-50 h-fit min-w-[340px] -translate-x-96 overflow-hidden rounded-e-xl bg-coal",
        "transition-all duration-300",
        {
          "translate-x-0": isOpen,
        },
      )}
    >
      <Brand
        className={"flex w-full border-b-[0.33px] border-gray-600 bg-coal pe-3"}
      >
        <div className="pt-2">
          <BrandName>
            <TicketsMono />
            <TitleMono />
          </BrandName>
        </div>
        <BtnIcon
          icon="arrow-left-01"
          onClick={toggleFn}
          bg="text-transparent"
          color="text-slate-400"
        />
      </Brand>
      <Contents sections={sections} />
      <TocFooter {...footer} />
    </div>
  );
};

const Contents = (props: { sections: Section[] }) => (
  <div className="space-y-4 overflow-y-auto bg-coal px-2 py-6">
    <h2 className="mb-4 ps-3 font-inter font-semibold tracking-tighter text-chalk">
      Table of Contents
    </h2>
    <nav className="space-y-1">
      <HyperList data={props.sections} component={SectionItem} keyId="keyId" />
    </nav>
  </div>
);

const SectionItem = (section: Section) => (
  <a
    key={section.id}
    href={`#${section.id}`}
    className="flex space-x-2 rounded-xl p-2 text-xs text-primary-300 transition-colors duration-300 hover:bg-indigo-100/5"
  >
    <div className="relative flex size-8 items-center justify-center">
      <Iconx name="squircle" className="absolute size-7 text-army opacity-15" />
      <p className="absolute text-sm font-semibold text-chalk">
        {section.keyId + 1}
      </p>
    </div>
    <div className="flex items-center font-inter font-medium tracking-tight text-indigo-50">
      {section.title}
    </div>
  </a>
);

const TocFooter = ({ label, href, company }: FooterProps) => (
  <div className="flex h-12 w-full items-center justify-between gap-2 border-t-[0.33px] border-gray-600 px-4 text-xs capitalize tracking-tight text-primary-400">
    <div className="flex gap-2">
      <Link href={"/"}>
        <span>&copy;&nbsp;{new Date().getFullYear()}</span>
        <span className="font-medium">&nbsp;&nbsp;{company}</span>
      </Link>
    </div>
    <Link
      href={href}
      className="flex items-center gap-2 text-indigo-300 hover:underline"
    >
      {label}
      <Iconx name="square-arrow-up-right" className="size-4" />
    </Link>
  </div>
);
