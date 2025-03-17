import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

export async function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Parse the token to verify its validity
  const parsedToken = token.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(parsedToken);

  if (!data) {
    console.error(error);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
