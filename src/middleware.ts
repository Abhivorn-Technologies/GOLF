import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development'
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // We only want to protect /admin and /api/admin
  // But we MUST allow access to the login and logout routes!
  if (
    pathname === "/admin/login" || 
    pathname === "/api/admin/login" || 
    pathname === "/api/admin/logout" ||
    pathname === "/api/admin/upload" // Depending on your upload needs, but generally protect it unless it's a webhook
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      if (pathname.startsWith("/api/admin")) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload.role !== 'admin') {
        throw new Error("Not an admin");
      }
      return NextResponse.next();
    } catch (error) {
      if (pathname.startsWith("/api/admin")) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
