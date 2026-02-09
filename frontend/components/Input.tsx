import { DetailedHTMLProps, InputHTMLAttributes } from "react"



type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
// type: "text" | "password"
// }

interface InputComponentProps {
    required?: boolean;
    disabled?: boolean;
    label?: string;
    inputProps: InputProps;
}

export const Input = (props: InputComponentProps) => {
    const { label, required, disabled, inputProps } = props;
    return (
        <div style={{ gap: "1rem" }} className="flex flex-col justify-center w-full sm:w-1/2 p-2">
            {label &&
                <span>{label}</span>
            }
            <input
                required={required}
                disabled={disabled}
                style={{ outline: "unset" }}
                className="flex border border-grey-400 p-2 flex-1"
                {...inputProps}
            />
        </div>
    )
}