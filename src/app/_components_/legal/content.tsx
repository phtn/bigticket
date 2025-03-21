"use client";

import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/lib/utils";
import { HyperList } from "@/ui/list";
import { copyFn } from "@/utils/helpers";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useCallback } from "react";
import { Toc } from "./toc";
import type {
  BodyProps,
  ContentProps,
  FooterProps,
  HeaderProps,
  ImportantMessageProps,
  Section,
} from "./types";
import { BtnIcon } from "@/ui/button/button-icon";
import { Iconx } from "@/icons";

export const Content = ({
  company,
  footer,
  important_message,
  sections,
  title,
}: ContentProps) => {
  const { open, toggle } = useToggle();

  return (
    <div className="bg-white font-inter transition-colors duration-300 md:min-h-screen">
      <Toc
        sections={sections}
        footer={{ ...footer, company }}
        isOpen={open}
        toggleFn={toggle}
      />
      <Header company={company} title={title} toggle={toggle} />
      <main className="container mx-auto h-[80vh] max-w-4xl overflow-y-scroll p-2 sm:px-6 lg:px-8">
        <Body sections={sections} message={important_message} />
        <Footer company={company} {...footer} />
      </main>
    </div>
  );
};

const Header = ({ company, title, toggle }: HeaderProps) => (
  <div className="mx-auto flex max-w-4xl items-center justify-between border-b-[0.33px] border-primary-200 py-4 ps-4 sm:px-6 md:p-2 lg:px-8">
    <h1 className="w-fit space-x-2 whitespace-nowrap font-inter text-xl font-medium capitalize tracking-tighter text-gray-900 md:text-3xl">
      <span className="font-extrabold">{company}</span>{" "}
      <span className="font-light">{title}</span>
    </h1>
    <section className="flex w-fit space-x-2 pe-2 sm:space-x-6 md:space-x-6 md:pe-2">
      <div>
        <BtnIcon
          id="content-list"
          onClick={toggle}
          icon="left-to-right-list-number"
        />
      </div>
      <div className="w-fit">
        <BtnIcon id="print" onClick={() => window.print()} icon="printer" />
      </div>
    </section>
  </div>
);

const Body = (props: BodyProps) => (
  <div className="container mx-auto">
    <ImportantMessage message={props.message} />
    <HyperList
      data={props.sections}
      component={Article}
      keyId="keyId"
      container="py-8 space-y-14 px-1 scroll-smooth"
    />
  </div>
);

const ImportantMessage = ({ message }: ImportantMessageProps) => (
  <div className="my-8 max-w-2xl">
    <div className="mx-2 h-6 w-fit rounded-t-[4px] bg-coal px-3 py-1 text-[11px] font-semibold uppercase text-indigo-100">
      important to read
    </div>
    <section
      className={cn(
        "mx-2 flex space-x-2 rounded-lg rounded-tl-none border-1.5 border-indigo-400 bg-indigo-100/50 py-4 pe-4 ps-2 text-justify font-inter shadow-sm",
      )}
    >
      <div className="flex size-8 flex-shrink-0 items-start justify-center p-1">
        <Iconx
          name="information-circle"
          className="size-5 stroke-0 text-indigo-500"
        />
      </div>
      <p className="text-sm font-light leading-6 text-indigo-900">{message}</p>
    </section>
  </div>
);

const Article = ({ id, title, content, keyId }: Section) => {
  const handleCopyContent = useCallback(async () => {
    await copyFn({ name: title, text: `${title} - ${content}` });
  }, [content, title]);
  return (
    <section
      id={id}
      className={cn(
        "space-y-2 rounded-lg border-[0.33px] border-white bg-white py-2 text-justify font-inter",
        "group-hover/list:border-primary-300/60 group-hover/list:shadow-md",
        "transition-all duration-300",
      )}
    >
      <div
        className={cn(
          "flex h-4 w-full items-center justify-between border-b-[0.33px] border-white px-2 py-5",
          "group-hover/list:border-primary-300/80",
        )}
      >
        <h2
          className={cn(
            "flex items-center space-x-2 text-xl font-semibold tracking-tighter text-primary-900",
            "transition-transform duration-400 ease-out group-hover/list:translate-x-1",
          )}
        >
          <span className="text-[16px] font-light opacity-80">
            {keyId + 1}.
          </span>
          <span>{title}</span>
        </h2>
        <Button
          size="sm"
          isIconOnly
          variant="light"
          className="mr-1 hidden animate-enter group-hover/list:flex"
          onPress={handleCopyContent}
        >
          <Iconx name="copy-01" className="size-4" />
        </Button>
      </div>
      <p className="p-4 leading-relaxed tracking-tight text-primary-700">
        {content}
      </p>
    </section>
  );
};

const Footer = ({ company, label, href }: FooterProps) => (
  <footer className="flex items-center justify-between px-2 py-4 text-center text-xs capitalize leading-none tracking-tighter text-primary">
    <div className="flex w-full items-start justify-between">
      <p className="capitalize">
        <span>&copy;&nbsp;{new Date().getFullYear()}</span>
        <span className="font-semibold">&nbsp;&nbsp;{company}</span>
      </p>
      <div className="justify-start">
        <p className="font-semibold">February 17, 2025</p>
        <p className="text-left text-tiny tracking-tight opacity-80">
          Last updated
        </p>
      </div>

      <Link
        href={href}
        className="flex items-center gap-1 text-indigo-600 hover:underline"
      >
        {label} <Iconx name="square-arrow-up-right" className="size-4" />
      </Link>
    </div>
  </footer>
);
