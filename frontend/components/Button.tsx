import Image from "next/image";
import Link from "next/link";
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
    label: "註冊" | "登入";
}

export const RegisterButton = (props: RegisterButtonProp) => {
    const { type, action, size = 20, label } = props;
    if (!["google", "line"].includes(type)) return
    const buttonInfo = ButtonType[type];

    return (
        <Link
            style={{ columnGap: ".5rem", userSelect: "none" }}
            className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2"
            type="submit"
            // formAction={action}
            href={`${process.env.HOST}/api/auth/${type}`}
        >
            {`使用`}
            <Image src={buttonInfo.src} alt={`${buttonInfo.label} ${label}`} width={size} height={size} />
            {`${buttonInfo.label} ${label}`}
        </Link>
    )
}