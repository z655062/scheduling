import { RegisterButton } from "@/components/Button";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default () => {
    async function handleLogin(formData: FormData) {
        "use server";
        const name = formData.get("username");
        const pass = formData.get("password");

        const response = await fetch('http://127.0.0.1:1746/api/auth/login', { // 請求您的後端 API
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, password: pass }),
            credentials: 'include',
        }).then((res) => res.json());

        (await cookies()).set('access_token', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
        });

        redirect("/welcome");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">歡迎登入</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">

                        <input className="border p-2" type="text" name="username" placeholder="帳號" />
                        <input className="border p-2" type="password" name="password" placeholder="密碼" />
                        <button className="border-2 px-4 py-1" formAction={handleLogin}>登入</button>
                        <RegisterButton type="google" label="登入" />
                        <RegisterButton type="line" label="登入" />
                        <Link className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2" href={"/register"}>註冊</Link>
                    </div>
                </form>
            </main>
        </div>
    )
}