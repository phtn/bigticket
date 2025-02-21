import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const uid = req.cookies.get("big-ticket--id")?.value;

  if (!uid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account",
    "/e/:path",
    {
      source: "/((?!.*\\..*|_next).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
    "/(api|trpc)(.*)",
  ],
};
