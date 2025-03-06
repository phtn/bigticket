import { api } from "@vx/api";
import { useMutation } from "convex/react";

export const useVxFiles = () => {
  const generateUrl = useMutation(api.files.create.url);
  const getUrl = useMutation(api.files.get.url);

  const create = async (file?: File) => {
    if (!file) return null;
    const postUrl = await generateUrl();
    const response = await fetch(postUrl, {
      method: "POST",
      body: file,
      headers: {
        "Content-Type": file?.type ?? "image/*",
      },
    });
    if (!response.ok) throw new Error("Failed to create file");
    const data = (await response.json()) as Promise<{ storageId: string }>;
    return (await data).storageId;
  };

  const mut = {
    create,
    get: async (storageId: string | undefined) =>
      storageId ? await getUrl({ storageId }) : null,
  };

  return {
    create: mut.create,
    getUrl: mut.get,
  };
};

export type VxFiles = ReturnType<typeof useVxFiles>;
