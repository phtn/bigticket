import { api } from "@vx/api";
import { useConvexUtils } from "./useConvexUtils";
import { useMutation } from "convex/react";

export const useVxFiles = () => {
  const { asyncFn } = useConvexUtils();
  const generateUrl = useMutation(api.files.create.url);
  const getUrl = useMutation(api.files.get.url);

  const create = async (file?: File) => {
    if (!file) return null;
    const postUrl = await generateUrl();
    await fetch(postUrl, {
      method: "POST",
      body: file,
      headers: {
        "Content-Type": file?.type ?? "image/*",
      },
    });
    return "success";
  };

  const mut = {
    create: asyncFn(create),
    get: async (storageId: string | undefined) =>
      storageId ? await getUrl({ storageId }) : null,
  };

  return {
    create: mut.create,
    getUrl: mut.get,
  };
};

export type VxFiles = ReturnType<typeof useVxFiles>;
