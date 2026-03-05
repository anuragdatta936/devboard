import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


export const runtime = "nodejs";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
  const isApiAuth  = nextUrl.pathname.startsWith("/api/auth") || nextUrl.pathname.startsWith("/api/test-db");

  // Always allow auth API routes
  if (isApiAuth) return NextResponse.next();

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
