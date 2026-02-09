"use client"
import { apiMethod } from "@/actions";
import { Input } from "@/components/Input";
import { MyCalendar } from "@/components/MyCalendar";
import Link from "next/link";
import { useState } from "react";
import { isSameDay } from "date-fns";
interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    type: 'work' | 'personal' | 'urgent';
}

const MOCK_EVENTS: CalendarEvent[] = [
    { id: "1", date: new Date(2025, 10, 26), title: "SOLID 原則研討會", type: "work" },
    { id: "2", date: new Date(2025, 10, 26), title: "健身房重訓", type: "personal" },
    { id: "3", date: new Date(2025, 10, 28), title: "Next.js 專案上線", type: "urgent" },
];

const ShiftPage = async () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // 過濾出所選日期的行程
    const selectedDayEvents = MOCK_EVENTS.filter(
        (event) => selectedDate && isSameDay(event.date, selectedDate)
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black h-screen">
                <form style={{ height: "100%" }} className="flex flex-col w-full sm:items-center items-start" >
                    <h1 className="">新增班表</h1>

                    <div style={{ height: "100%", borderColor: "deepskyblue", rowGap: "1rem" }} className="flex flex-col items-center container border-2 rounded p-8">
                        <MyCalendar
                            events={MOCK_EVENTS}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />
                    </div>
                </form>
            </main>
        </div>
    )
}

export default ShiftPage;