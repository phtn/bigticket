import { type NextRequest, NextResponse } from "next/server";
import { useAuth } from "@/app/ctx/auth/provider";
const { supabase } = useAuth();

export async function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Parse the token to verify its validity
  const parsedToken = token.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(parsedToken);

  if (!data) {
    console.error(error);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
