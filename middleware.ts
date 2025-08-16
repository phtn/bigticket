import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Parse the Firebase ID token
    const idToken = token.replace("Bearer ", "");

    // Verify the Firebase ID token using Firebase REST API
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.NEXT_PUBLIC_F_APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
        }),
      }
    );

    if (!response.ok) {
      console.error("Firebase token verification failed");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const data = await response.json();

    if (!data.users || data.users.length === 0) {
      console.error("No user found for token");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Token is valid, proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    // Add your protected routes here
    "/account/:path*",
    "/admin/:path*",
    // Add other protected routes as needed
  ],
};
