import type { NextFetchEvent, NextRequest } from "next/server";
import { Ok, Result } from "ts-results-es";

/* Takes an a string which might be an ip address returns it */
function parseIp(maybeIp: string): Result<string, Error> {
  // Might be the loopback in devmode
  if (maybeIp == "::1") {
    return Ok("127.0.0.10");
  }
  // ipv6 mapped to ipv4?
  if (maybeIp.startsWith("::ffff:")) {
    return Ok(maybeIp.split("::ffff:")[1]);
  }
  return Ok(maybeIp);
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest, event: NextFetchEvent) {
  if (
    request.nextUrl.pathname.length > 4 &&
    request.nextUrl.pathname.slice(-5) == ".jpeg" // TODO: Get this check in the regex below to improve performance
  ) {
    return;
  }
  const API_URL = request.nextUrl.clone();
  API_URL.pathname = "api";
  const maybeIp = request.ip || request.headers.get("X-Forwarded-For");
  const ip = parseIp(maybeIp as string).unwrap(); // FIXME: Remove the unwrap
  console.log(ip);
  console.log(request.nextUrl.pathname);
  event.waitUntil(
    fetch(API_URL + "/visit", {
      method: "POST",
      body: JSON.stringify({
        visitor_ip: ip,
        page_url: request.nextUrl.pathname,
        visited_at: Date.now(),
      }),
    }),
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
