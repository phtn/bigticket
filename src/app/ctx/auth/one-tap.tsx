"use client";

import { use, useCallback, useEffect } from "react";
import { Err } from "@/utils/helpers";
import { type CredentialResponse } from "google-one-tap";
import { env } from "@/env";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AuthCtx } from "@/app/ctx/auth";
import { onError } from "@/app/ctx/toast";
import { useSession } from "./useSession";
import { setUserID } from "@/app/actions";
import { log } from "@/utils/logger";

export const GoogleOneTap = () => {
  const supabase = useSupabaseClient().auth;
  const { user, updateUser } = use(AuthCtx)!;
  const { pending, userSessionData } = useSession();

  const generateNonce = useCallback(() => {
    let hashedNonce = undefined;
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const enc = new TextEncoder();
    const encodedNonce = enc.encode(nonce);
    crypto.subtle
      .digest("SHA-256", encodedNonce)
      .then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashedNonce = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      })
      .catch(Err);
    if (hashedNonce) {
      return { nonce, hashedNonce };
    }
  }, []);

  useEffect(() => {
    if (!pending && userSessionData.inSession) {
      updateUser(userSessionData.user);
      return;
    }
    const n = generateNonce();

    const timeout = setTimeout(() => {
      // Load Google Identity Services (GSI) script dynamically
      const loadGoogleScript = () => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = initializeGoogleOneTap;
      };

      // Initialize Google One Tap
      const initializeGoogleOneTap = () => {
        if (!window.google) {
          log(" Google GSI library not found.", window.google);
          return;
        }

        if (!n?.hashedNonce) {
          log("No hashedNonce", n?.hashedNonce);
        }

        try {
          window.google.accounts.id.initialize({
            client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // From .env.local
            callback: handleGoogleCredentialResponse,
            nonce: n?.hashedNonce,
            use_fedcm_for_prompt: true,
            cancel_on_tap_outside: true,
          });
        } catch (err) {
          if (err) {
            onError("Error");
            log("onetap init", err);
          }
        }

        window.google.accounts.id.prompt();
      };

      // Handle the Google Credential Response
      const handleGoogleCredentialResponse = (response: CredentialResponse) => {
        (async () => {
          log("Response", response.credential.substring(0, 8));

          try {
            const { data, error } = await supabase.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce: n?.nonce,
            });

            if (error) {
              log("Supabase Auth Error", error.message);
            } else {
              updateUser(data.user);
              await setUserID(data.user.id);
              log("User authenticated wit", data);
            }
          } catch (err) {
            log("Error authenticating", typeof err === "object" ? err : null);
          }
        })().catch(Err);
      };

      if (!user) {
        log("check user-session, With user session", user);
        loadGoogleScript();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [supabase, pending, userSessionData, generateNonce, updateUser, user]);

  return (
    <div id="tap-dat-ass" className="hidden">
      Google One Tap is enabled.
    </div>
  );
};
