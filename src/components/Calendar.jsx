"use client";
import React from 'react';
import {
    format,
    addMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isToday,
    getDay
} from 'date-fns';

const Calendar = ({ selectedDate, setSelectedDate, theme = 'dark' }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const getDaysOfMonth = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        return eachDayOfInterval({ start, end });
    };

    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthDays = getDaysOfMonth(currentMonthStart);

    const handleDayClick = (date) => {
        const formattedDate = format(date, 'EEE MMMM d, yyyy');
        setSelectedDate({ raw: date, display: formattedDate });
    };

    const renderDay = (date) => {
        const dayText = format(date, 'd');
        const isSelected =
            selectedDate?.raw &&
            format(selectedDate.raw, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');

        const isDark = theme === 'dark';

        const baseClasses = `p-3 cursor-pointer text-center rounded-lg text-sm font-medium transition-all duration-200 ease-in-out`;

        const todayClass = isToday(date)
            ? isDark
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-blue-500 text-white font-semibold'
            : '';

        const selectedClass = isSelected
            ? isDark
                ? 'bg-green-600 text-white font-semibold scale-105'
                : 'bg-green-500 text-white font-semibold scale-105'
            : isDark
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700';

        const hoverClass = isDark
            ? 'hover:bg-blue-500 hover:text-white active:scale-95'
            : 'hover:bg-blue-200 hover:text-blue-800 active:scale-95';

        return (
            <div
                key={date}
                className={`${baseClasses} ${todayClass || selectedClass} ${hoverClass}`}
                onClick={() => handleDayClick(date)}
            >
                {dayText}
            </div>
        );
    };

    const getDayHeaders = () => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return daysOfWeek.map((day, index) => (
            <div
                key={index}
                className={`text-center font-semibold text-sm py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
            >
                {day}
            </div>
        ));
    };

    const firstDayOfMonth = getDay(currentMonthStart);
    const lastRowPadding = (7 - (currentMonthDays.length + firstDayOfMonth) % 7) % 7;

    return (
        <div
            className={`rounded-xl shadow-lg w-full p-4 space-y-4 transition-colors ${theme === 'dark' ? 'bg-gray-900' : 'bg-white border border-gray-200'
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <button
                    className={`text-xl px-3 py-1 rounded-full transition ${theme === 'dark'
                            ? 'text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                >
                    &lt;
                </button>
                <h3
                    className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}
                >
                    {format(currentMonthStart, 'MMMM yyyy')}
                </h3>
                <button
                    className={`text-xl px-3 py-1 rounded-full transition ${theme === 'dark'
                            ? 'text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                    &gt;
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1">{getDayHeaders()}</div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-start-${i}`} />
                ))}

                {currentMonthDays.map((day) => renderDay(day))}

                {Array.from({ length: lastRowPadding }).map((_, i) => (
                    <div key={`empty-end-${i}`} />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
