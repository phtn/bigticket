"use server";

import { env } from "@/env";
import { createClient } from "pexels";

const pexels = createClient(env.PEXELS_API);

export const getPexels = async (
  query: string,
  page: number,
  locale: string,
) => {
  const px = await pexels.photos.search({
    query,
    locale,
    page,
    per_page: 15,
    height: 400,
    orientation: "landscape",
  });

  return px;
};
