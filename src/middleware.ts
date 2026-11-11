import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rewrite /@<user_name> or /%40<user_name> to /u/<user_name>
  // e.g. /@john -> /u/john
  if (pathname.startsWith('/@') || pathname.startsWith('/%40')) {
    const rawUsername = pathname.startsWith('/@')
      ? pathname.slice(2)
      : pathname.slice(4);

    // Get the username portion (ignoring trailing slash or subpaths)
    const cleanUsername = rawUsername.split('/')[0]?.trim();

    if (cleanUsername) {
      const url = request.nextUrl.clone();
      url.pathname = `/u/${cleanUsername}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match /@username and /%40username paths
     */
    '/@:path*',
    '/%40:path*',
  ],
};
