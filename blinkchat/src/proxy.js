import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isChatPage = pathname === "/";

  if (!token && isChatPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
