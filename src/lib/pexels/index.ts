import { getPexels } from "@/app/account/(tabs)/events/e/[id]/actions";
import { type QueryData } from "@/app/account/(tabs)/events/e/[id]/components/pexels/types";
import { Err } from "@/utils/helpers";
import { type Photo } from "pexels";
import { useCallback, useEffect, useState } from "react";

export const usePexels = ({ query, locale }: QueryData) => {
  const [images, setImages] = useState<Photo[]>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadImages = useCallback(
    async (page: number) => {
      setLoading(true);
      const response = await getPexels(
        query ?? "party",
        page,
        locale ?? "en-US",
      );
      if ("error" in response) {
        Err(setLoading, response.error);
        return;
      }

      console.log(response.total_results);

      setImages(response.photos);
      setLoading(false);
    },
    [query, locale],
  );

  useEffect(() => {
    loadImages(page).catch((res) => {
      Err(setLoading);
      console.error(res);
    });
  }, [loadImages, page]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  return { images, nextPage, prevPage, loading };
};
