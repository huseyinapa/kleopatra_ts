import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, localePrefix, locales, pathnames } from "./i18n/config";
import createIntlMiddleware from "next-intl/middleware";
import { refreshAction } from "./actions/auth/refresh";
import { verifyToken } from "./lib/jwt";
import { getSessionAction } from "@/actions/auth/session";

const protectedPages = ["/profile"] as Array<keyof typeof pathnames>;
const authPages = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-email",
] as Array<keyof typeof pathnames>;

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
});

/**
 * Test if the pathname matches any of the pages and tree of pages
 * @param pages Array of pages
 * @param pathname Pathname to test
 * @returns Boolean
 */
const testPagesRegex = (
  pages: Array<keyof typeof pathnames>,
  pathname: string
) => {
  const regexParts = pages.flatMap((page) => {
    const path = pathnames[page];
    if (typeof path === "string") {
      if (path === "/") {
        return [""];
      }
      const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return [`${escapedPath}(\\/.*)?`];
    } else if (typeof path === "object") {
      return Object.values(path).map((p) => {
        const escapedPath = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return `${escapedPath}(\\/.*)?`;
      });
    }
    return [];
  });

  const regex = `^(/(${locales.join("|")}))?(${regexParts.join("|")})/?$`;
  return new RegExp(regex, "i").test(pathname);
};

/**
 * Refresh and validate session
 * @param req The request object
 * @param refreshToken The refresh token
 * @param redirectToLogin Redirect to login page
 * @returns NextResponse
 */
const refreshAndValidateSession = async (
  req: NextRequest,
  refreshToken: string,
  redirectToLogin: NextResponse
) => {
  const refreshResult = await refreshAction(refreshToken);

  if (refreshResult.error) {
    return redirectToLogin;
  }

  const isSessionValid = await getSessionAction();

  if (isSessionValid.error) {
    return redirectToLogin;
  }

  return intlMiddleware(req);
};

const handleAuth = async (
  req: NextRequest,
  isAuthPage: boolean,
  isProtectedPage: boolean,
  isLogoutPage: boolean
) => {
  const accessToken = req.cookies.get("accessToken")?.value as string;
  const refreshToken = req.cookies.get("refreshToken")?.value as string;

  const accessTokenVerification = await verifyToken(accessToken);
  const refreshTokenVerification = await verifyToken(refreshToken);

  const hasValidAccessToken = accessTokenVerification.valid;
  const hasValidRefreshToken = refreshTokenVerification.valid;

  let from = req.nextUrl.pathname;
  if (req.nextUrl.search) {
    from += req.nextUrl.search;
  }

  const redirectToLogin = NextResponse.redirect(
    new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
  );

  const tryRefresh = () =>
    refreshAndValidateSession(req, refreshToken, redirectToLogin);

  if ((hasValidRefreshToken || hasValidAccessToken) && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isLogoutPage && !hasValidRefreshToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!hasValidAccessToken) {
    if (isProtectedPage || isLogoutPage) {
      if (hasValidRefreshToken) {
        return tryRefresh();
      } else if (!isLogoutPage) {
        return redirectToLogin;
      }
    } else {
      // Burası public sayfalarda da api isteği attığımdan kaynaklı aslında koymayıp access token gerektirmeyen bir endpoint kullanabilirim.
      if (hasValidRefreshToken) {
        return tryRefresh();
      }
    }
  }

  return intlMiddleware(req);
};

export default async function middleware(req: NextRequest) {
  const isAuthPage = testPagesRegex(authPages, req.nextUrl.pathname);
  const isProtectedPage = testPagesRegex(protectedPages, req.nextUrl.pathname);
  const isLogoutPage = testPagesRegex(["/auth/logout"], req.nextUrl.pathname);

  return await handleAuth(req, isAuthPage, isProtectedPage, isLogoutPage);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|sitemap|.*\\..*|/).*)"],
};
