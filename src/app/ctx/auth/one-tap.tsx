"use client";

import { useCallback, useEffect } from "react";
import { Err } from "@/utils/helpers";
import { type CredentialResponse } from "google-one-tap";
import { env } from "@/env";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithCredential,
  type User as FirebaseUser,
} from "firebase/auth";
import { onError } from "@/app/ctx/toast";
import { useSession } from "./useSession";
import { setUserEmail, setUserID } from "@/app/actions";
import { log } from "@/utils/logger";
import { useAuthStore } from "./store";
import { type User as SupabaseUser } from "@supabase/supabase-js";

export const GoogleOneTap = () => {
  const { user, updateUser } = useAuthStore();
  const { isLoading, session } = useSession();

  // Convert Firebase User to Supabase User format
  const convertFirebaseUserToSupabase = useCallback(
    (firebaseUser: FirebaseUser): SupabaseUser => {
      return {
        id: firebaseUser.uid,
        aud: "authenticated",
        role: "authenticated",
        email: firebaseUser.email ?? "",
        phone: firebaseUser.phoneNumber ?? "",
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          name: firebaseUser.displayName ?? "",
          full_name: firebaseUser.displayName ?? "",
          avatar_url: firebaseUser.photoURL ?? "",
          email: firebaseUser.email ?? "",
          email_verified: firebaseUser.emailVerified,
          iss:
            "https://securetoken.google.com/" + firebaseUser.uid.split("|")[0],
          sub: firebaseUser.uid,
          provider_id: "google.com",
        },
        identities: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_anonymous: false,
      };
    },
    [],
  );

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
            const credential = GoogleAuthProvider.credential(
              response.credential,
            );
            const result = await signInWithCredential(auth, credential);

            if (result.user) {
              const supabaseUser = convertFirebaseUserToSupabase(result.user);
              updateUser(supabaseUser);
              await setUserID(result.user.uid);
              await setUserEmail(result.user.email ?? undefined);
              log("Firebase Auth Success", result.user.uid);
            }
          } catch (err) {
            log(
              "Firebase Auth Error",
              err instanceof Error ? err.message : "Unknown error",
            );
            onError("Error authenticating with Firebase");
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
  }, [
    isLoading,
    session,
    generateNonce,
    updateUser,
    user,
    convertFirebaseUserToSupabase,
  ]);

  return (
    <div id="tap-dat-ass" className="hidden">
      Google One Tap is enabled.
    </div>
  );
};
