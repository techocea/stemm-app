import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/signup");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  //Change to "/signup" when product is launched
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);

      // If already logged in, don't let them go back to signup/login
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/signup", request.url));
      }
    } catch (error) {
      //Change to "/signup" when product is launched
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signup"],
};
