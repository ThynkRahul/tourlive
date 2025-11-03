export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // redirect english locale → root canonical
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url);
  }

  // Allow all static/public files to pass through
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Check if URL already has locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // no redirect for english default - root stays english directly
  if (!pathnameHasLocale) {
    return NextResponse.next();
  }

  // ======== DO NOT MOVE ANYTHING ABOVE HERE ========
  // Get locale from path
  const locale = getLocaleFromPath(pathname);
