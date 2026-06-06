import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");
  const response = NextResponse.next();

  if (country && /^[A-Z]{2}$/.test(country)) {
    response.cookies.set("ut-country", country, {
      maxAge: 3600,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images).*)"],
};
