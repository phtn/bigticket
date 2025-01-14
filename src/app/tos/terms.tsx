import { HyperList } from "@/ui/list";
import { type Section } from "./content";
import { Button } from "@nextui-org/react";
import { Icon } from "@/icons";
import { cn } from "@/lib/utils";

export const TermsSection = ({ id, title, content, keyId }: Section) => {
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
          <span className="text-[16px] font-light opacity-50">
            {keyId + 1}.
          </span>
          <span>{title}</span>
        </h2>
        <Button
          size="sm"
          isIconOnly
          variant="light"
          className="mr-1 hidden animate-enter group-hover/list:flex"
        >
          <Icon name="Copy" className="size-4" />
        </Button>
      </div>
      <p className="p-4 leading-relaxed tracking-tight text-primary-700">
        {content}
      </p>
    </section>
  );
};

export const TermsOfUse = (props: { sections: Section[] }) => (
  <div>
    <div className="my-8">
      <div className="mx-2 h-6 w-fit rounded-t-[4px] bg-coal px-3 py-1 text-[11px] font-semibold uppercase text-indigo-100">
        important to read
      </div>
      <section
        className={cn(
          "mx-2 flex space-x-2 rounded-lg rounded-tl-none border-1.5 border-indigo-400 bg-indigo-100/50 py-4 pe-4 ps-2 text-justify font-inter shadow-sm",
        )}
      >
        <div className="flex size-8 flex-shrink-0 items-start justify-center p-1">
          <Icon name="InfoLine" className="size-5 stroke-0 text-indigo-500" />
        </div>
        <p className="text-sm font-light leading-6 text-indigo-900">
          {`BigTicket, Inc. ("we," "our," "us") is committed to protecting your
                            privacy and safeguarding your personal information. This Privacy
                            Policy explains how we collect, use, disclose, and safeguard your
                            information when you visit our web application ("App") or use our
                            services. By accessing or using our App, you agree to this Privacy
                            Policy. If you do not agree with the terms, please do not use our
                            services.`}
        </p>
      </section>
    </div>
    <HyperList
      data={props.sections}
      component={TermsSection}
      keyId="keyId"
      container="h-[calc(100vh-8rem)] py-24 space-y-14 overflow-y-scroll px-1 scroll-smooth"
    />
  </div>
);
