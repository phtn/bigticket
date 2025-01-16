import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import { deleteUserID } from "../actions";
import { onError } from "../ctx/toast";

export const useSignOut = () => {
  const supabase = useSupabaseClient().auth;

  const cleanUp = useCallback(async () => {
    await deleteUserID();
    const response = await supabase.signOut();
    if (response.error !== null) return onError("Failed to sign out.");
  }, [supabase]);

  return { cleanUp };
};
