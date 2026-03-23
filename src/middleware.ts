import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    /^\/mandor\/[^/]+/.test(pathname) ||
    /^\/explore\/[^/]+/.test(pathname);

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/mandor/:path*", "/explore/:path*"],
};
