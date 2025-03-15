"use client";

import Link from "next/link";
import { Image } from "@nextui-org/react";
import { Hyper } from "@/ui/button/button";
import { Iconx } from "@/icons/icon";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Proxima = () => {
  return (
    <footer className="text-chalk">
      <div className="">
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
          src="/icon/logomark_v2.svg"
          alt="big-ticket-logomark"
          className="size-10 sm:size-14"
        />
      </div>
      <Iconx
        name="plus-sign"
        className={cn(
          "absolute -right-3 -top-3 text-ticket transition-transform duration-500",
          { "-rotate-180": spin },
        )}
      />
    </div>
  );
};

const CompanyInfo = () => {
  return (
    <div className="flex h-auto w-full flex-col justify-between border-l-[0.33px] border-dotted border-ticket leading-none">
      <div className="flex h-2/3 w-full items-center border-b-[0.33px] border-dashed border-ticket/80 px-8">
        <h1 className="text-lg font-black text-vanilla">
          Big Ticket
          <span className="ps-2 font-normal opacity-80">
            Ticketing Services
          </span>
        </h1>
      </div>
      <div className="flex h-1/3 items-center">
        <div className="hidden items-center space-x-4 border-r-[0.33px] border-dotted border-ticket/80 px-8 text-sm opacity-80 sm:flex">
          <Iconx name="location-01" className="size-4" />
          <p>Quezon City, Philippines</p>
        </div>
        <div className="flex items-center space-x-6 px-8 text-sm opacity-80">
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
    <div className="relative w-full border-l-[0.33px] border-t-[0.33px] border-dotted border-ticket p-8 text-center sm:border-t-0">
      <h3 className="mb-4 text-sm font-semibold text-vanilla">Quick Links</h3>
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
          "absolute -bottom-3 -right-3 rotate-0 text-ticket transition-transform duration-300",
          { "rotate-90": spin },
        )}
      />
    </div>
  );
};

const Resources = () => {
  return (
    <div className="border-l-[0.33px] border-t-[0.33px] border-dotted border-ticket p-8 text-center sm:border-t-0">
      <h3 className="mb-4 text-sm font-bold text-vanilla">Resources</h3>
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

// export const Proxima = () => {
//   return (
//     <div className="flex h-full max-h-[50vh] w-full rounded-t-3xl bg-gray-600">
//       <div className="flex w-full flex-col justify-stretch overflow-clip border border-macd-blue p-4">
//         {/* <div className="relative z-20 h-full w-full border-[0.33_px] px-4 xl:px-10"></div> */}

//         <div className="z-20 flex h-fit w-full border border-tan text-xs leading-none text-chalk xl:px-10">
//           <div className="space-y-8 border">
//             <div className="flex aspect-square h-auto w-20 items-center justify-center rounded-full bg-white">
//               <Image
//                 src="/icon/logomark_v2.svg"
//                 alt="big-ticket-logomark"
//                 className="size-14"
//               />
//             </div>

//             <section className="flex h-fit w-full items-start justify-around space-x-2 border pb-8 text-xs text-chalk">
//               <div className="h-full py-0.5">
//                 <Iconx
//                   name="location-01"
//                   className="size-3.5 text-chalk drop-shadow-md"
//                 />
//               </div>
//               <div className="space-y-0.5 whitespace-nowrap not-italic opacity-60">
//                 <address className="not-italic">5F Crissant Plaza Bldg</address>
//                 <address className="not-italic">272 Commonwealth Ave</address>
//                 <address className="not-italic">
//                   Quezon City, 1119 Metro Manila
//                 </address>
//               </div>
//             </section>
//           </div>
//           <div className="flex h-full w-full items-end space-x-4"></div>
//           <div className="flex w-full items-center justify-center"></div>
//         </div>

//         <div className="relative z-20 flex h-fit w-full items-end justify-between space-x-4 border border-ticket px-4 py-4 text-xs leading-none text-chalk/60 xl:px-10">
//           <div className="flex items-end space-x-4">
//             <p className="flex w-fit space-x-2 font-medium tracking-tight">
//               <span className="font-light">
//                 &copy;&nbsp;{new Date().getFullYear()}
//               </span>
//               <span>BigTicket</span>
//               <span className="hidden font-light sm:flex">
//                 Ticketing Services
//               </span>
//             </p>
//           </div>
//           <div className="flex items-end space-x-1.5 font-inter text-tiny tracking-tight">
//             <Link href={"/privacy-policy"} className="hover:underline">
//               <p className="">Privacy Policy</p>
//             </Link>
//             <p className="opacity-60">&middot;</p>

//             <Link
//               href={"/tos"}
//               className="underline-offset-2 hover:text-secondary hover:underline"
//             >
//               <p className="">Terms of Use</p>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
