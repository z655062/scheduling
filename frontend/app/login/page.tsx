import { RegisterButton } from "@/components/Button";
import { Input } from "@/components/Input";
import Link from "next/link";
import "dotenv/config";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

const Login = () => {
    async function handleLogin(formData: FormData) {
        "use server";
        const username = formData.get("username");
        const password = formData.get("password");

        const data = JSON.stringify({
            username, password
        });

        const res = fetch(`${process.env.BACKEND_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        }).then(res => {
            return res.json()
        })

        const result = await res;
        console.log("🚀 ~ handleLogin ~ result:", result.token);

        if (result?.token === undefined) return;

        (await cookies()).set("t", result.token, {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })

        redirect("/welcome");

    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">歡迎登入</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">
                        <Input required name="username" type="text" placeholder="帳號" />
                        <Input required name="password" type="password" placeholder="密碼" />
                        <button className="flex justify-center border w-full sm:w-1/2 p-2" style={{ backgroundColor: "black", color: "white" }} formAction={handleLogin}>登入</button>
                        <RegisterButton type="google" label="登入" />
                        <RegisterButton type="line" label="登入" />
                        <Link className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2" href={"/register"}>註冊</Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Login;