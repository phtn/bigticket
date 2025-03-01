"use client";

import { useCallback, useEffect } from "react";
import { Err } from "@/utils/helpers";
import { type CredentialResponse } from "google-one-tap";
import { env } from "@/env";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { onError } from "@/app/ctx/toast";
import { useSession } from "./useSession";
import { setUserID } from "@/app/actions";
import { log } from "@/utils/logger";
import { useAuthStore } from "./store";

export const GoogleOneTap = () => {
  const supabase = useSupabaseClient().auth;
  const { user, updateUser } = useAuthStore();
  const { isLoading, session } = useSession();

  const generateNonce = useCallback(() => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const enc = new TextEncoder();
    const encodedNonce = enc.encode(nonce);
    return crypto.subtle
      .digest("SHA-256", encodedNonce)
      .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedNonce = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        return { nonce, hashedNonce };
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }, []);

  useEffect(() => {
    if (!isLoading && session?.user) {
      updateUser(session.user);
      return;
    }

    const initializeGoogleOneTap = async () => {
      const n = await generateNonce();
      if (!n) return;

      const loadGoogleScript = () => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
          if (!window.google) {
            log("Google GSI library not found.", window.google);
            return;
          }

          try {
            window.google.accounts.id.initialize({
              client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: handleGoogleCredentialResponse,
              nonce: n.hashedNonce,
              use_fedcm_for_prompt: true,
              cancel_on_tap_outside: true,
            });
            window.google.accounts.id.prompt();
          } catch (err) {
            onError("Error initializing Google One Tap");
            console.error("One Tap init error", err);
          }
        };
      };

      const handleGoogleCredentialResponse = (response: CredentialResponse) => {
        (async () => {
          log("Response", response.credential.substring(0, 8));

          try {
            const { data, error } = await supabase.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce: n.nonce,
            });

            if (error) {
              log("Supabase Auth Error", error.message);
            } else {
              updateUser(data.user);
              await setUserID(data.user.id);
            }
          } catch (err) {
            log("Error authenticating", typeof err === "object" ? err : null);
          }
        })().catch(Err);
      };

      if (!user) {
        log("No user session, loading Google script", true);
        loadGoogleScript();
      }
    };

    const timeout = setTimeout(() => {
      initializeGoogleOneTap().catch(Err);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [supabase, isLoading, session, generateNonce, updateUser, user]);

  return (
    <div id="tap-dat-ass" className="hidden">
      Google One Tap is enabled.
    </div>
  );
};
