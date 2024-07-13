import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export default async function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId");
  const res = NextResponse.next();

  if (!userId) {
    const id = uuidv4();
    res.cookies.set("userId", id);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * If cookie with key userId is missing
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [{ type: "cookie", key: "userId" }],
    },
  ],
};
