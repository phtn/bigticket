"use client";

import { setCookie } from "@/app/actions";
import { useAccountAuthStore } from "@/app/ctx/auth/g-store";
import { onError } from "@/app/ctx/toast";
import { env } from "@/env";
import { auth } from "@/lib/firebase";
import { Err } from "@/utils/helpers";
import { Log } from "@/utils/logger";
import { type InsertAccount } from "convex/accounts/d";
import {
  GoogleAuthProvider,
  signInWithCredential,
  type User as FirebaseAccount,
} from "firebase/auth";
import { type CredentialResponse } from "google-one-tap";
import { useCallback, useEffect } from "react";

export const GoogleOneTap = () => {
  const { account, updateAccount, isAuthed } = useAccountAuthStore();

  // Check if user is already authenticated

  // Convert Firebase Account to Supabase Account format
  const parseAccountSchema = useCallback(
    (firebaseAccount: FirebaseAccount): InsertAccount => {
      return {
        ...firebaseAccount,
        email: firebaseAccount.email ?? "",
        updated_at: Date.now(),
      };
    },
    [],
  );

  const generateNonce = useCallback(async () => {
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
    // Only initialize Google One Tap if account is NOT authenticated
    if (isAuthed) {
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
            Log("Google GSI library not found.", window.google);
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
          Log("Response", response.credential.substring(0, 8));

          try {
            const credential = GoogleAuthProvider.credential(
              response.credential,
            );
            const { user: acct } = await signInWithCredential(auth, credential);

            if (acct) {
              // const account = parseAccountSchema(acct);

              updateAccount(acct);
              await setCookie("userId", acct.uid ?? null);
              await setCookie("userEmail", acct.email ?? "");
              Log("Firebase Auth Success", acct.uid);
            }
          } catch (err) {
            Log(
              "Firebase Auth Error",
              err instanceof Error ? err.message : "Unknown error",
            );
            onError("Error authenticating with Firebase");
          }
        })().catch(Err);
      };

      if (!isAuthed) {
        Log("No account session, loading Google script", true);
        loadGoogleScript();
      }
    };

    const timeout = setTimeout(() => {
      initializeGoogleOneTap().catch(Err);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isAuthed, generateNonce, updateAccount, account, parseAccountSchema]);

  return (
    <div id="tap-dat-ass" className="hidden">
      Google One Tap is enabled.
    </div>
  );
};
