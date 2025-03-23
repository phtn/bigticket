import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),

    //CONVEX
    CONVEX_DEPLOYMENT: z.string(),
    //PEXELS
    PEXELS_API: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_SECURE: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_FROM_EMAIL: z.string(),

    //FIREBASE
    FIREBASE_STORAGE_BUCKET: z.string(),
    FIREBASE_STORAGE_TOKEN: z.string(),

    //PAYMONGO
    PAYMONGO_PK: z.string(),
    PAYMONGO_SK: z.string(),
    PAYMONGO_WHSK: z.string(),

    //BASE
    CC_API_KEY: z.string(),
    WC_PROJECT_ID: z.string(),

    //RE_UP_API
    RE_UP_API: z.string(),

    //UPSTASH
    UPSTASH_WORKFLOW_URL: z.string().url(),
    QSTASH_TOKEN: z.string(),
  },

  client: {
    //CONVEX
    NEXT_PUBLIC_CONVEX_URL: z.string().url(),

    //GOOGLE
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),

    //SUPABASE
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),

    //BASE
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: z.string(),

    //FIREBASE

    NEXT_PUBLIC_F_APIKEY: z.string(),
    NEXT_PUBLIC_F_AUTHDOMAIN: z.string(),
    NEXT_PUBLIC_F_PROJECTID: z.string(),
    NEXT_PUBLIC_F_STORAGEBUCKET: z.string(),
    NEXT_PUBLIC_F_MESSAGINGSENDERID: z.string(),
    NEXT_PUBLIC_F_APPID: z.string(),
    NEXT_PUBLIC_F_MEASUREMENTID: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    //CONVEX
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,

    //GOOGLE
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,

    //SUPABASE
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    //PEXELS
    PEXELS_API: process.env.PEXELS_API,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,

    //FIREBASE
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_STORAGE_TOKEN: process.env.FIREBASE_STORAGE_TOKEN,

    //FIREBASE CLIENT
    NEXT_PUBLIC_F_APIKEY: process.env.NEXT_PUBLIC_F_APIKEY,
    NEXT_PUBLIC_F_AUTHDOMAIN: process.env.NEXT_PUBLIC_F_AUTHDOMAIN,
    NEXT_PUBLIC_F_PROJECTID: process.env.NEXT_PUBLIC_F_PROJECTID,
    NEXT_PUBLIC_F_STORAGEBUCKET: process.env.NEXT_PUBLIC_F_STORAGEBUCKET,
    NEXT_PUBLIC_F_MESSAGINGSENDERID:
      process.env.NEXT_PUBLIC_F_MESSAGINGSENDERID,
    NEXT_PUBLIC_F_APPID: process.env.NEXT_PUBLIC_F_APPID,
    NEXT_PUBLIC_F_MEASUREMENTID: process.env.NEXT_PUBLIC_F_MEASUREMENTID,

    //PAYMONGO
    PAYMONGO_PK: process.env.PAYMONGO_PK,
    PAYMONGO_SK: process.env.PAYMONGO_SK,
    PAYMONGO_WHSK: process.env.PAYMONGO_WHSK,

    //BASE
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
    CC_API_KEY: process.env.CC_API_KEY,

    //WALLETCONNECT
    WC_PROJECT_ID: process.env.WC_PROJECT_ID,

    //RE_UP_API
    RE_UP_API: process.env.RE_UP_API,

    //UPSTASH
    UPSTASH_WORKFLOW_URL: process.env.UPSTASH_WORKFLOW_URL,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
