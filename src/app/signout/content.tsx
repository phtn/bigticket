"use client";

import { ChineBorder } from "@/ui/card/border";
import { motion } from "motion/react";
import { LineShadow } from "@/ui/text/line-shadow";
import { useSignOut } from "./useSignOut";
import { useEffect } from "react";
import { Err } from "@/utils/helpers";
import { onSuccess } from "../ctx/toast";

export const Content = () => {
  const { cleanUp } = useSignOut();
  useEffect(() => {
    let timer: NodeJS.Timeout;
    cleanUp()
      .then(() => {
        onSuccess("Sign out successful!");
        timer = setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      })
      .catch(Err);
    return () => clearTimeout(timer);
  }, [cleanUp]);
  return (
    <div className="flex h-[calc(90vh)] justify-center bg-white py-8">
      <motion.div className="h-fit pt-32">
        <ChineBorder
          color={["#FFBE7B", "#02C7BE"]}
          borderRadius={32}
          borderWidth={2}
          className="h-fit w-fit bg-gradient-to-br from-shade via-fade/50 to-cake px-8 py-12 shadow-xl shadow-shade"
        >
          <div className="whitespace-nowrap text-xl font-semibold leading-none tracking-tight text-macl-gray">
            Signing out...
          </div>
        </ChineBorder>
      </motion.div>
      <LineShadow
        shadowColor="#FFBE7B"
        className="absolute whitespace-nowrap text-[5rem] font-semibold leading-none tracking-tight text-macl-gray/60"
      >
        catch you on the flipside!
      </LineShadow>
    </div>
  );
};
