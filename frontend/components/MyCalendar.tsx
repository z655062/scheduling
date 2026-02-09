"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
// import { CalendarEvent } from "@/types/event";
import { isSameDay } from "date-fns";

interface MyCalendarProps {
  events: CalendarEvent[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}
interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'work' | 'personal' | 'urgent';
}
export function MyCalendar({ events, selectedDate, onDateSelect }: MyCalendarProps) {
  // 建立一個紀錄有行程日期的陣列
  const eventDates = events.map((event) => event.date);

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="rounded-md"
        // v9 使用 modifiers 來定義特定狀態
        modifiers={{
          booked: eventDates,
        }}
        // 針對該狀態定義樣式（這符合 Tailwind 擴充習慣）
        modifiersClassNames={{
          booked: "after:content-[''] after:block after:w-1 after:h-1 after:bg-blue-500 after:rounded-full after:mx-auto after:mt-1"
        }}
      // 如果需要更複雜的 DOM 結構，v9 使用對應的組件名稱
      // components={{
      //   // 在 v9 中，DayRender 是處理每一格渲染的關鍵
      //   Day: ({ day, displayMonth, ...dayProps }) => {
      //     const hasEvent = events.some((e) => isSameDay(e.date, date));

      //     // 這裡可以根據有無行程，動圖調整樣式
      //     return (
      //       <div
      //         {...dayProps}
      //         className={`${dayProps.className} relative`}
      //       >
      //         {day()}
      //         {hasEvent && (
      //           <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
      //         )}
      //       </div>
      //     );
      //   }
      // }}
      />
    </div>
  );
}