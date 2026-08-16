import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  verifyTableAccess,
} from "@/lib/tableAccess";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const slug = pathname.split("/")[2];
  if (!slug) {
    return NextResponse.redirect(new URL("/invalid", request.url));
  }

  const tokenFromQuery = searchParams.get("k");
  const tokenFromCookie = request.cookies.get(ACCESS_COOKIE)?.value;
  const queryAccess = await verifyTableAccess(tokenFromQuery);
  const cookieAccess = await verifyTableAccess(tokenFromCookie);

  if (queryAccess && queryAccess.slug === slug) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("k");
    const response = NextResponse.redirect(clean);
    response.cookies.set(ACCESS_COOKIE, tokenFromQuery!, accessCookieOptions());
    return response;
  }

  if (cookieAccess && cookieAccess.slug === slug) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/invalid", request.url));
}

export const config = {
  matcher: ["/restaurant/:path*"],
};
