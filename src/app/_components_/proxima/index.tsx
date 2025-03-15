"use client";

import Link from "next/link";
import { Iconx } from "@/icons/icon";
import { Image } from "@nextui-org/react";
import { Hyper } from "@/ui/button/button";

export const Proxima = () => {
  return (
    <footer className="pt-12 text-chalk">
      <div className="mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="">
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex aspect-square h-auto w-20 items-center justify-center rounded-full bg-white">
                <Image
                  src="/icon/logomark_v2.svg"
                  alt="big-ticket-logomark"
                  className="size-14"
                />
              </div>
            </div>
            <p className="mb-4 max-w-xs text-sm opacity-80">
              Bringing events, experiences, and entertainment closer to you.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Iconx name="ticket-tilted" className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-vanilla">
              Quick Links
            </h3>
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
          </div>

          <div>
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
        </div>
        <div className="mt-12 flex h-44 items-end border-t border-ticket pt-8">
          <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex w-full max-w-sm space-x-2">
                <Hyper label="Chat with us" rounded end="message-01" />
              </div>
            </div>
            <div className="flex items-end justify-start md:justify-end">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Big Ticket
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
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
