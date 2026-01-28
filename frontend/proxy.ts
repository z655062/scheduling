// middleware.ts or proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log("pathname", pathname)
    const isAuthenticated = request.cookies.has("t");
    console.log(isAuthenticated)

    if (!isAuthenticated && pathname !== "/login") {
        // Redirect unauthenticated users to the login page
        return NextResponse.redirect(new URL("/login", request.url));
    } else if (isAuthenticated && ["/", "/login"].includes(pathname)) {
        return NextResponse.redirect(new URL('/welcome', request.url))
    }

    return NextResponse.next();
}

// Optionally, define a matcher to run middleware only on specific paths
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
        "/" // Also run on the homepage
    ],
};
