"use client";

import { ChineBorder } from "@/ui/card/border";
import { motion } from "motion/react";
import { useSignOut } from "./useSignOut";
import { useEffect } from "react";
import { Err } from "@/utils/helpers";
import { Bouncy } from "@/ui/loader/bouncy";

export const Content = () => {
  const { cleanUp } = useSignOut();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    cleanUp()
      .then(() => {
        timer = setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      })
      .catch(Err);
    return () => clearTimeout(timer);
  }, [cleanUp]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full justify-center bg-void py-8">
      <div>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 0 }}
          transition={{ duration: 10, delay: 2 }}
        >
          <ChineBorder
            color={["#FFBE7B", "#02C7BE"]}
            borderRadius={32}
            borderWidth={4}
            duration={6}
            className="h-fit w-fit bg-gradient-to-br from-shade via-fade to-cake p-8 shadow-lg shadow-shade"
          >
            <div className="flex gap-2 whitespace-nowrap font-inter font-medium leading-none -tracking-widest text-primary">
              <span>Signing out</span>
              <Bouncy />
            </div>
          </ChineBorder>
        </motion.div>
      </div>
    </div>
  );
};
