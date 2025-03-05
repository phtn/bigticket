// import { setAccountID } from "@/app/actions";
// import type { SelectUser } from "convex/users/d";
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import type { ReactNode } from "react";
// import { useConvexCtx } from ".";
// import { Err } from "@/utils/helpers";
// import { useQuery } from "convex/react";
// import { api } from "@vx/api";
// import { q } from "./utils";
// import { useAuth } from "../auth/provider";
// import { useTransition } from "react";

// interface VxCtxValues {
//   vx: SelectUser | null;
//   pending: boolean;
//   photo_url: string | null;
// }
// export const VxCtx = createContext<VxCtxValues | null>(null);

// export const VxProvider = ({ children }: { children: ReactNode }) => {
//   const { user } = useAuth();
//   const [isLoading, startTransition] = useTransition();
//   const [vx, setVx] = useState<SelectUser | null>(null);
//   const [photo_url, setPhotoURL] = useState<string | null>(null);
//   const { files } = useConvexCtx();

//   const vxUser = useQuery(api.users.get.byId, { id: q(user?.id) });

//   useEffect(() => {
//     if (user) {
//       startTransition(() => {
//         if (vxUser) {
//           setVx(vxUser);
//         }
//       });
//     }
//   }, [vxUser, user]);

//   const getPhotoURL = useCallback(async () => {
//     if (!vx?.photo_url) return null;
//     const url = vx?.photo_url;
//     if (url.startsWith("https")) {
//       return url;
//     }
//     return await files.get(url);
//   }, [files, vx?.photo_url]);

//   useEffect(() => {
//     startTransition(() => {
//       getPhotoURL().then(setPhotoURL).catch(Err);
//     });
//   }, [getPhotoURL]);

//   const setAccountId = useCallback(async (account_id: string | undefined) => {
//     if (!account_id) return;
//     startTransition(() => {
//       setAccountID(account_id).catch(Err);
//     });
//   }, []);

//   useEffect(() => {
//     if (vx?.account_id) {
//       setAccountId(vx.account_id).catch(Err);
//     }
//   }, [setAccountId, vx?.account_id]);

//   const value = useMemo(
//     () => ({
//       vx,
//       pending: isLoading,
//       photo_url,
//     }),
//     [vx, isLoading, photo_url],
//   );

//   return <VxCtx.Provider value={value}>{children}</VxCtx.Provider>;
// };

// export const useVx = () => {
//   const context = useContext(VxCtx);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
