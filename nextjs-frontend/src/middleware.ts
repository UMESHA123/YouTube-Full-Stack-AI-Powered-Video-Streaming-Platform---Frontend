import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = new Set(["/signin", "/signup"]);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
