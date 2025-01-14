import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import {
  type Dispatch,
  type SetStateAction,
  type TransitionStartFunction,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { setUserID } from "@/app/actions";
import { log } from "@/utils/logger";

interface UserSessionData {
  inSession: boolean;
  user: User | null;
}
export const useSession = () => {
  const supabase = useSupabaseClient().auth;
  const [userSessionData, setUserSessionData] = useState<UserSessionData>({
    inSession: false,
    user: null,
  });

  const [session, setSession] = useState<{
    session: Session | null;
    error: AuthError | null;
  }>({ session: null, error: null });

  const [pending, fn] = useTransition();

  const setFn = useCallback(
    <T>(
      tx: TransitionStartFunction,
      action: () => Promise<T>,
      set: Dispatch<SetStateAction<T>>,
    ) => {
      tx(async () => {
        set(await action());
      });
    },
    [],
  );

  const getSession = useCallback(async () => {
    try {
      const { error: sessionError } = await supabase.getSession();
      if (sessionError) {
        return { inSession: false, user: null };
      }

      const { error: userError, data } = await supabase.getUser();
      if (userError) {
        return { inSession: false, user: null };
      }

      await setUserID(data.user.id);
      return { inSession: true, user: data.user };
    } catch (err) {
      log("session x user", err instanceof Error ? { ...err } : null);
      return { inSession: false, user: null };
    }
  }, [supabase]);

  const getUserSessionData = useCallback(() => {
    setFn(fn, getSession, setUserSessionData);
  }, [getSession, setFn]);

  useEffect(() => {
    getUserSessionData();
  }, [getUserSessionData]);

  const getUserSession = useCallback(async () => {
    const result = await supabase.getSession();
    setSession({ ...result.data, error: result.error });
  }, [supabase]);

  const getFedCMStatus = useCallback(async () => {
    if (typeof window !== "undefined")
      try {
        // Test if the browser supports the FedCM API
        const ident =
          await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        const res = await fetch(
          "https://example.com/.well-known/web-identity",
          {
            mode: "cors",
            credentials: "include",
          },
        );
        log("result", res);
        log("ident", ident);
        return true;
      } catch (e) {
        // NotSupportedError typically indicates FedCM is disabled
        if (e instanceof Error && e.name === "NotSupportedError") {
          return false;
        }
        // Other errors might mean FedCM is enabled but the request failed for other reasons
        console.error("Error checking FedCM:", e);
        return true;
      }
  }, []);

  return { userSessionData, pending, session, getUserSession, getFedCMStatus };
};
