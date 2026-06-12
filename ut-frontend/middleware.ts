import { NextResponse, type NextRequest } from "next/server";

// Matches a two-letter lowercase country prefix, e.g. /ke or /ke/docs
const CC_RE = /^\/([a-z]{2})(\/(.*))?$/;

// Countries we recognise as valid URL prefixes
const VALID_COUNTRIES = new Set([
  "ke", "tz", "ug", "rw", "et", "ng", "gh", "za", "eg",
  "us", "gb", "ca", "au", "in", "sg", "ae", "de", "fr",
  "nl", "se", "no", "fi", "jp", "cn", "kr", "br", "mx",
  "zm", "mz", "zw", "bw", "na", "sn", "ci",
]);

// Attach the ut-country cookie to any response when Vercel tells us the
// visitor's country and we don't already have a cookie for them.
function withCountryCookie(res: NextResponse, request: NextRequest): NextResponse {
  if (!request.cookies.has("ut-country")) {
    const cc = request.headers.get("x-vercel-ip-country")?.toLowerCase();
    if (cc) {
      res.cookies.set("ut-country", cc, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
        httpOnly: false, // JS needs it for the flag display in the nav
      });
    }
  }
  return res;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine country: existing cookie → Vercel header → nothing
  const country = (
    request.cookies.get("ut-country")?.value ??
    request.headers.get("x-vercel-ip-country") ??
    ""
  ).toLowerCase();

  // Redirect bare `/` to `/{country}` when we know the visitor's country
  if (pathname === "/") {
    if (country && VALID_COUNTRIES.has(country)) {
      return withCountryCookie(
        NextResponse.redirect(new URL(`/${country}`, request.url)),
        request,
      );
    }
    return withCountryCookie(NextResponse.next(), request);
  }

  const match = CC_RE.exec(pathname);
  if (!match) return withCountryCookie(NextResponse.next(), request);

  const cc = match[1];
  const rest = match[3]; // everything after /{cc}/

  if (!VALID_COUNTRIES.has(cc)) return withCountryCookie(NextResponse.next(), request);

  // /{cc}  →  home page, handled by app/[country]/page.tsx — let through
  if (!rest) return withCountryCookie(NextResponse.next(), request);

  // /{cc}/{page...}  →  internally rewrite to /{page...}
  // Browser URL stays /{cc}/{page...} for SEO; Next.js renders app/{page}/page.tsx
  const rewriteUrl = new URL(request.url);
  rewriteUrl.pathname = `/${rest}`;
  return withCountryCookie(NextResponse.rewrite(rewriteUrl), request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images|_allauth|accounts|api).*)"],
};
