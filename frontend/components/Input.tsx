import { DetailedHTMLProps, InputHTMLAttributes } from "react"



type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
// type: "text" | "password"
// }

export const Input = (props: InputProps) => {
    return <input
        className="flex justify-center border border-grey-400 w-full sm:w-1/2 p-2"
        {...props}
    />
}