import { RegisterButton } from "@/components/Button";
import Link from "next/link";

export default () => {
    async function handleLineLogin(formData: FormData) {
        "use server";
        const name = formData.get("name");
        console.log("來自伺服端的處理：", name);
    }

    async function handleGoogleLogin(formData: FormData) {
        "use server";
        const name = formData.get("name");
        console.log("來自伺服端的處理：", name);
    }

    async function handleRegistry(formData: FormData) {
        "use server";
        const name = formData.get("name");
        console.log("來自伺服端的處理：", name);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">歡迎登入</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">

                        <RegisterButton type="google" action={handleGoogleLogin} label="登入" />
                        <RegisterButton type="line" action={handleLineLogin} label="登入" />
                        <Link className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2" href={"/register"}>註冊</Link>
                    </div>
                </form>
            </main>
        </div>
    )
}