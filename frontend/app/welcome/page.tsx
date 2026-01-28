import { cookies } from "next/headers";

async function fetchCurrentUser() {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get('access_token');

    if (!jwtCookie) {
        return null; // 沒有 Token，視為未登入
    }

    try {
        const response = await fetch('http://127.0.0.1:1746/api/user/me', {
            method: "Get",
            headers: {
                // 將 Cookie 內容手動放入 Header，後端才能驗證
                Authorization: `Bearer ${jwtCookie.value}`,
            },
        }).then((res) => res.json());

        return response;
    } catch (error) {
        console.error('後端 API 呼叫失敗:', error);
        throw new Error('無法獲取使用者資料');
    }
}

const welcome = async () => {
    async function handleLogout(formData: FormData) {
        "use server";
        (await cookies()).delete("access_token");
    }
    const user = await fetchCurrentUser();
    console.log("🚀 ~ user:", user)
    return (
        <form>
            {`Hi ${user.username}`}
            <button formAction={handleLogout}>登出</button>
        </form>
    )
}


export default welcome;