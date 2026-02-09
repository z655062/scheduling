import { apiMethod } from "@/actions";
import { Input } from "@/components/Input";
import Link from "next/link";
import { DatePicker } from "@/components/DatePicker";


const ShiftPage = async () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">新增班表</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">
                        <Input required label="班表名稱" inputProps={{ name: "name", type: "text", placeholder: "班表名稱" }} />
                        <Input required label="起始日期" inputProps={{ name: "start_date", type: "date", placeholder: "起始日期" }} />
                        <Input required label="結束日期" inputProps={{ name: "end_date", type: "date", placeholder: "結束日期" }} />
                        <button className="flex items-center justify-center border border-grey-400 w-full sm:w-1/2 p-2" type="submit"> {"新增"}</button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ShiftPage;