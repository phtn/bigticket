import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState, useTransition } from "react";
import { setUserID } from "@/app/actions";
import { log } from "@/utils/logger";

interface SessionState {
  isLoading: boolean;
  error: AuthError | null;
  session: Session | null;
  user: User | null;
}

const initialState: SessionState = {
  isLoading: true,
  error: null,
  session: null,
  user: null,
};

export const useSession = () => {
  const supabase = useSupabaseClient().auth;
  const [state, setState] = useState<SessionState>(initialState);
  const [isPending, startTransition] = useTransition();

  const updateState = useCallback((updates: Partial<SessionState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const getSession = useCallback(async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!sessionData.session) {
        return updateState({
          session: null,
          user: null,
          isLoading: false,
        });
      }

      const { data: userData, error: userError } = await supabase.getUser();

      if (userError) {
        throw userError;
      }

      if (userData.user) {
        await setUserID(userData.user.id);
      }

      updateState({
        session: sessionData.session,
        user: userData.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      log("Session error:", error instanceof Error ? error : "Unknown error");
      updateState({
        error: error as AuthError,
        session: null,
        user: null,
        isLoading: false,
      });
    }
  }, [supabase, updateState]);

  const refreshSession = useCallback(() => {
    startTransition(() => {
      updateState({ isLoading: true });
      getSession().catch((err) => {
        updateState({ isLoading: false });
        console.error(err);
      });
    });
  }, [getSession, updateState]);

  useEffect(() => {
    refreshSession();

    const {
      data: { subscription },
    } = supabase.onAuthStateChange(() => {
      refreshSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, refreshSession]);

  const checkFedCMSupport = useCallback(async () => {
    if (typeof window === "undefined") return false;

    try {
      const isSupported =
        await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      if (!isSupported) return false;

      const response = await fetch(
        "https://example.com/.well-known/web-identity",
        {
          mode: "cors",
          credentials: "include",
        },
      );

      return response.ok;
    } catch (error) {
      if (error instanceof Error && error.name === "NotSupportedError") {
        return false;
      }
      log("FedCM check error:", error as Error);
      return false;
    }
  }, []);

  return {
    ...state,
    isPending,
    refreshSession,
    checkFedCMSupport,
  };
};
