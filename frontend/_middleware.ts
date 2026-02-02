import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rootRoute = "/welcome";
const loginRoute = "/login";
const protectedRoutes = [rootRoute];


// export function middleware(request) {
//     // 1. 取得當前請求的路徑
//     const currentPath = request.nextUrl.pathname;

//     // 2. 檢查路徑是否為受保護路徑
//     const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

//     // 3. 如果路徑是受保護的
//     if (isProtectedRoute) {
//         // 獲取 token，通常存在 Cookies 中（Middleware 只能訪問 Cookies）
//         // 假設 token 儲存在名為 "auth_token" 的 cookie 中
//         const token = request.cookies.get("auth_token");

//         // 4. 如果沒有 token，則重定向到登入頁面
//         if (!token) {
//             // 構造重定向的 URL
//             const url = new URL(loginRoute, request.url);

//             // (可選) 增加 "redirectedFrom" 參數，讓登入成功後可以跳回原來的頁面
//             // url.searchParams.set("redirectedFrom", currentPath); 

//             return NextResponse.redirect(url);
//         }
//     }

//     // 5. 有 token 或不是受保護頁面，則繼續請求
//     return NextResponse.next();
// }
export const middleware = (request: NextRequest) => {
    const currentPath = request.nextUrl.pathname;

    // 規則 1: 重設跟目錄
    if (currentPath === "/") {
        console.log("根路徑 / 沒有頁面，重定向至 /welcome...");

        // 構建目標 URL
        const url = new URL(rootRoute, request.url);

        // 執行重定向
        return NextResponse.redirect(url);
    }

    // 規則 2: 檢查 token
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    if (isProtectedRoute) {
        const token = request.cookies.get("access_token");

        if (!token) {
            const url = new URL(loginRoute, request.url);

            // (可選) 增加 "redirectedFrom" 參數，讓登入成功後可以跳回原來的頁面
            // url.searchParams.set("redirectedFrom", currentPath); 

            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        // 排除 _next/static, API 路由等，只匹配頁面路由
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};