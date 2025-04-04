import { ref, getDownloadURL } from "firebase/storage";
import crypto from "crypto";
import { type NextRequest } from "next/server";
import { storage } from "@/lib/firebase";

function computeETag(content: string) {
  const hash = crypto.createHash("md5");
  hash.update(content, "utf8");
  const contentHash = hash.digest("hex");

  return `"${contentHash}"`;
}

export async function GET(request: NextRequest) {
  try {
    const logoRef = ref(storage, "public/browser.svg");

    const url = await getDownloadURL(logoRef);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch logo from Firebase");
    }

    const svgContent = await response.text();

    // Check if the client sent an If-None-Match header (for caching)
    const ifNoneMatch = request.headers.get("if-none-match");
    const etag = computeETag(svgContent);

    // If client already has the current version, return 304 Not Modified
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          ETag: etag,
        },
      });
    }

    // Otherwise return the SVG with caching headers
    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
      },
    });
  } catch (error) {
    console.error("Error serving logo:", error);
    return new Response("Error fetching logo", { status: 500 });
  }
}
