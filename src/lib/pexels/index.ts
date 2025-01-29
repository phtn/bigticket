import { getPexels } from "@/app/e/[id]/actions";
import { Err } from "@/utils/helpers";
import { type Photo } from "pexels";
import { useCallback, useEffect, useState } from "react";

export const usePexels = () => {
  const [images, setImages] = useState<Photo[]>();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("cyberpunk");
  const [loading, setLoading] = useState(false);

  const loadImages = useCallback(
    async (page: number) => {
      setLoading(true);
      const response = await getPexels(query, page, "ja-JP");
      if ("error" in response) {
        Err(setLoading, response.error);
        return;
      }

      setImages(response.photos);
      setLoading(false);
    },
    [query],
  );

  useEffect(() => {
    loadImages(page).catch((res) => {
      Err(setLoading);
      console.error(res);
    });
  }, [loadImages, page, query]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return { images, nextPage, prevPage, loading, updateQuery };
};
