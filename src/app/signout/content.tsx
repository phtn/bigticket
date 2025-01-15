"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { ChineBorder } from "@/ui/card/border";
import { LineShadow } from "@/ui/text/line-shadow";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { deleteUserID } from "../actions";

export const Content = () => {
  const router = useRouter();
  const supabase = useSupabaseClient().auth;
  const signOut = supabase.signOut();

  const initSignOut = useCallback(async () => {
    await toast.promise(signOut, {
      loading: "Signing out...",
      success: "Successfully signed out!",
    });
    await deleteUserID();
    router.push("/");
  }, [router, signOut]);

  const signOutButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    signOutButton.current?.click();
  }, [signOutButton]);

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
        className="absolute whitespace-nowrap text-[6rem] font-semibold leading-none tracking-tight text-macl-gray/60"
      >
        catch you on a flip!
      </LineShadow>
      <button className="hidden" ref={signOutButton} onClick={initSignOut}>
        Sign out
      </button>
    </div>
  );
};
