import { NextRequest, NextResponse } from "next/server";

const isDashboardClientPath = (pathname: string) =>
  pathname === "/dashboard/client" || pathname.startsWith("/dashboard/client/");

const isDashboardMandorPath = (pathname: string) =>
  pathname === "/dashboard/mandor" || pathname.startsWith("/dashboard/mandor/");

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/mandor/") && pathname !== "/mandor");

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isDashboardClientPath(pathname) && role !== "client") {
    if (role === "mandor") {
      return NextResponse.redirect(
        new URL("/dashboard/mandor/projects", request.url),
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isDashboardMandorPath(pathname) && role !== "mandor") {
    if (role === "client") {
      return NextResponse.redirect(
        new URL("/dashboard/client/projects", request.url),
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/mandor/:path*"],
};
