"use client";

import { Icon } from "@/icons";
import Link from "next/link";
import { Brand, BrandName, Tickets, Title } from "../navbar/brand";

export const Proxima = () => {
  return (
    <div className="flex h-[42vh] w-full items-center justify-center rounded-t-3xl bg-coal">
      <div className="relative flex h-full w-full flex-col items-start justify-start overflow-clip">
        <div className="relative z-20 h-full w-full border-[0.33_px] px-4 xl:px-10"></div>

        <div className="dark:text-chalk-dark font-inst relative z-20 flex h-full w-full items-center justify-between px-8 text-xs leading-none text-chalk xl:px-10">
          <div className="flex h-1/3 w-full flex-col items-start justify-center space-y-6">
            <div className="big-ticket flex w-full items-end space-x-4">
              <Brand className="flex">
                <BrandName>
                  <Tickets />
                  <Title />
                </BrandName>
              </Brand>
            </div>

            <section className="dark:text-chalk-dark flex items-start justify-around space-x-4 px-2 pt-2 text-xs text-chalk">
              <div className="h-full py-0.5">
                <Icon
                  name="MapPin"
                  className="dark:text-chalk-dark size-4 text-vanilla drop-shadow-md"
                />
              </div>
              <div className="font-inst space-y-0.5">
                <p></p>
                <p>Manila, Philippines</p>
                {/* <p>Taguig, Metro Manila 1634</p> */}
              </div>
            </section>
          </div>
          <div className="flex h-full w-full items-end space-x-4"></div>
          <div className="flex w-full items-center justify-center"></div>
        </div>

        <div className="dark:text-chalk-dark font-inst relative z-20 flex h-[calc(100vh/4)] w-full items-end justify-between space-x-4 px-4 py-4 text-xs leading-none text-chalk/60 xl:px-10">
          <div className="flex h-1/3 items-end space-x-4">
            <p className="font-medium tracking-tight">
              Big Ticket Philippines{" "}
              <span className="font-light">
                &copy;{new Date().getFullYear()}
              </span>
            </p>
          </div>
          <div className="flex h-1/2 items-end space-x-2 font-inter tracking-tight">
            <Link href={"/privacy-policy"} className="hover:underline">
              <p className="">Privacy Policy</p>
            </Link>
            <p className="opacity-50">&middot;</p>

            <Link href={"/tos"} className="hover:underline">
              <p className="">Terms of Use</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
