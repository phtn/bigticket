"use client";

import Link from "next/link";
import { Image } from "@nextui-org/react";
import { Hyper } from "@/ui/button/button";
import { Iconx } from "@/icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type ClassName } from "@/app/types";
import dynamic from "next/dynamic";

interface Props {
  className?: ClassName;
}

export const Proxima = ({ className }: Props) => {
  return (
    <footer className={cn("w-full text-chalk", className)}>
      <div className="w-full">
        <div className="grid w-full grid-cols-2 border-y-[0.33px] border-dotted border-ticket sm:grid-cols-5 md:gap-y-8">
          <div className="col-span-2 flex sm:col-span-3">
            <CompanyLogo />
            <CompanyInfo />
          </div>

          <QuickLinks />

          <Resources />
        </div>
        <InteractivePanel />
      </div>
    </footer>
  );
};

const CompanyLogo = () => {
  const [spin, setSpin] = useState(false);
  useEffect(() => {
    const interaval = setInterval(() => {
      setSpin((prev) => !prev);
    }, 15000);
    return () => clearInterval(interaval);
  }, []);
  return (
    <div className="relative p-8">
      <div className="flex aspect-square h-auto w-14 items-center justify-center rounded-full bg-white sm:w-20">
        <Image
          src="/api/logo"
          alt="big-ticket-logomark"
          className="size-10 sm:size-14"
        />
      </div>
      <Iconx
        name="plus-sign"
        className={cn(
          "absolute -right-3 -top-3 opacity-30 transition-transform duration-500",
          { "-rotate-180": spin },
        )}
      />
    </div>
  );
};

const CompanyInfo = () => {
  return (
    <div className="flex h-auto w-full flex-col justify-between border-l-[0.33px] border-dotted border-ticket leading-none">
      <div className="flex h-2/3 w-full flex-col justify-center space-y-1 border-b-[0.33px] border-dashed border-ticket/60 px-6 sm:h-2/3 sm:px-8 md:h-1/2 md:space-y-0.5">
        <h1 className="font-black tracking-tight sm:text-lg">
          Big Ticket
          <span className="ps-1 font-normal opacity-80"></span>
        </h1>
        <p className="text-sm tracking-tight opacity-60">
          A Social Events Hosting Platform
        </p>
      </div>
      <div className="flex h-1/3 items-center tracking-tight sm:h-1/3 md:h-1/2">
        <div className="hidden items-center space-x-4 border-r-[0.33px] border-dotted border-ticket/80 px-8 text-sm opacity-80 lg:flex">
          <Iconx name="location-01" className="size-4" />
          <p>Quezon City, Philippines</p>
        </div>
        <div className="flex items-center space-x-4 px-6 text-sm opacity-80 sm:space-x-6 sm:px-8">
          <Iconx name="mail-send" className="size-4" />
          <p className="text-sm">hq@bigticket.com</p>
        </div>
      </div>
      {/* <p className="text-xs opacity-80">
        Bring events, experiences, and entertainment closer to your audience.
      </p> */}
    </div>
  );
};

const QuickLinks = () => {
  const [spin, setSpin] = useState(false);
  useEffect(() => {
    const interaval = setInterval(() => {
      setSpin((prev) => !prev);
    }, 12000);
    return () => clearInterval(interaval);
  }, []);

  return (
    <div className="relative w-full border-t-[0.33px] border-dotted border-ticket p-8 text-center sm:border-l-[0.33px] sm:border-t-0">
      <h3 className="mb-8 text-sm font-semibold sm:mb-4">Quick Links</h3>
      <ul className="space-y-3 text-xs opacity-80">
        <li>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
          >
            Upcoming Events
          </Link>
        </li>
        <li>
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
        </li>
      </ul>
      <Iconx
        name="plus-sign"
        className={cn(
          "absolute -bottom-3 -right-3 rotate-0 opacity-30 transition-transform duration-300",
          { "rotate-90": spin },
        )}
      />
    </div>
  );
};

const Resources = () => {
  return (
    <div className="border-l-[0.33px] border-t-[0.33px] border-dotted border-ticket p-8 text-center sm:border-t-0">
      <h3 className="mb-8 text-sm font-bold sm:mb-4">Resources</h3>
      <ul className="space-y-3 text-xs opacity-80">
        <li>
          <Link href="/privacy-policy" className="">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            href="/tos"
            className="text-muted-foreground hover:text-foreground"
          >
            Terms of Use
          </Link>
        </li>
      </ul>
    </div>
  );
};

const InteractivePanel = () => {
  return (
    <div className="mt-12 flex h-32 items-end pt-8 sm:h-44">
      <div className="grid w-full grid-cols-2 gap-8">
        <div className="">
          <div className="hidden w-full">
            <Hyper
              label="Chat with us"
              className="px-2"
              rounded
              sm
              end="message-01"
            />
          </div>
        </div>
        <div className="flex items-end justify-end p-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Big Ticket
          </p>
        </div>
      </div>
    </div>
  );
};

const ProximaFallback = () => (
  <div className="fixed bottom-0 left-0 right-0 h-16 w-full animate-pulse bg-coal/20" />
);

export const DynamicProxima = dynamic(
  () => import("../../_components_/proxima").then((mod) => mod.Proxima),
  {
    ssr: false,
    loading: () => <ProximaFallback />,
  },
);
