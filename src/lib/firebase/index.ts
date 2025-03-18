import { initializeApp } from "firebase/app";
import { getRemoteConfig } from "firebase/remote-config";
import { getStorage } from "firebase/storage";
import { env } from "@/env";

const config = {
  apiKey: env.NEXT_PUBLIC_F_APIKEY,
  authDomain: env.NEXT_PUBLIC_F_AUTHDOMAIN,
  projectId: env.NEXT_PUBLIC_F_PROJECTID,
  storageBucket: env.NEXT_PUBLIC_F_STORAGEBUCKET,
  messagingSenderId: env.NEXT_PUBLIC_F_MESSAGINGSENDERID,
  appId: env.NEXT_PUBLIC_F_APPID,
  measurementId: env.NEXT_PUBLIC_F_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(config);
export const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
export const storage = getStorage(app);
