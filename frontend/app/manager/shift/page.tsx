import { apiMethod } from "@/actions";
import Link from "next/link";


const ShiftPage = async () => {
    const data = await apiMethod.get("/admin/shift/ranges")
    console.log(data)
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">歡迎登入</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">
                        <Link className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2" href={"/register"}>新增班表</Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ShiftPage;