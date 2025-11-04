export default () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black sm:items-center items-start h-screen">
                <h1 className="">歡迎登入</h1>

                <div style={{ height: "100%" }} className="container border-2 rounded border-gray-400 p-8">
                    <input type="text" />
                    <button onClick={()=> console.log("123")}>註冊</button>
                </div>
            </main>
        </div>
    )
}