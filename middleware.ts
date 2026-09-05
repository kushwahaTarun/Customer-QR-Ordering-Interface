import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  startDiningSession,
} from "@/lib/diningSession";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  verifyTableAccess,
} from "@/lib/tableAccess";

function withSessionCookie(response: NextResponse, sessionToken: string | null) {
  if (sessionToken) {
    response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
  }
  return response;
}

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

  if (queryAccess && queryAccess.slug === slug && tokenFromQuery) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("k");
    const response = NextResponse.redirect(clean);
    response.cookies.set(ACCESS_COOKIE, tokenFromQuery, accessCookieOptions());

    const sessionToken = await startDiningSession({
      restaurantSlug: slug,
      tableNumber: queryAccess.table,
      accessKey: tokenFromQuery,
    });
    return withSessionCookie(response, sessionToken);
  }

  if (cookieAccess && cookieAccess.slug === slug && tokenFromCookie) {
    const existingSession = request.cookies.get(SESSION_COOKIE)?.value;
    if (existingSession) {
      return NextResponse.next();
    }

    const sessionToken = await startDiningSession({
      restaurantSlug: slug,
      tableNumber: cookieAccess.table,
      accessKey: tokenFromCookie,
    });

    if (!sessionToken) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    return withSessionCookie(response, sessionToken);
  }

  return NextResponse.redirect(new URL("/invalid", request.url));
}

export const config = {
  matcher: ["/restaurant/:path*"],
};
