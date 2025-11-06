import Link from "next/link";
import Image from "next/image";

const ButtonType = {
    "line": {
        src: "line.svg",
        label: "Line",
    },
    "google": {
        src: "google.svg",
        label: "Google",
    },
}

interface RegisterButtonProp {
    type: "line" | "google";
    action: string | ((formData: FormData) => void | Promise<void>) | undefined;
    size?: number | `${number}`;
}

const RegisterButton = (props: RegisterButtonProp) => {
    const { type, action, size = 20 } = props;
    if (!["google", "line"].includes(type)) return
    const buttonInfo = ButtonType[type];

    return (
        <button
            style={{ columnGap: ".5rem", userSelect: "none" }}
            className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2"
            type="submit"
            formAction={action}
        >
            {`使用`}
            <Image src={buttonInfo.src} alt="我的圖示" width={size} height={size} />
            {`${buttonInfo.label} 註冊`}
        </button>
    )
}

export default () => {
    async function handleLineRegister(formData: FormData) {
        "use server";
        const name = formData.get("name");
        console.log("來自伺服端的處理：", name);
    }

    async function handleGoogleRegister(formData: FormData) {
        "use server";
        const name = formData.get("name");
        console.log("來自伺服端的處理：", name);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">註冊</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">
                        <RegisterButton type="google" action={handleGoogleRegister} />
                        <RegisterButton type="line" action={handleLineRegister} />
                    </div>
                </form>
            </main>
        </div>
    )
}