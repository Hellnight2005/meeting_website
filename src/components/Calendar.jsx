"use client";
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay } from 'date-fns';
import { gsap } from 'gsap';
import { formatDate } from '../utils/formatDate'; // Importing the formatDate function

const Calendar = ({ selectedDate, setSelectedDate, theme = 'dark' }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const daysRef = useRef([]);

    // Memoize days of the current month to avoid unnecessary recalculations
    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthDays = useMemo(() => {
        const end = endOfMonth(currentMonthStart);
        return eachDayOfInterval({ start: currentMonthStart, end });
    }, [currentMonth]);

    // GSAP animation only triggers on month change
    useEffect(() => {
        gsap.fromTo(
            daysRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.03,
                duration: 0.6,
                ease: 'power2.out',
            }
        );
    }, [currentMonth]);

    // Use formatDate function to format the date
    const handleDayClick = (date) => {
        const formattedDate = formatDate(date);
        setSelectedDate({ raw: date, display: formattedDate });
        console.log('Selected Date:', formattedDate);  // Log the selected date to the console
    };

    const renderDay = (date, index) => {
        const dayText = format(date, 'd');
        const isSelected = selectedDate?.raw && format(selectedDate.raw, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        const isDark = theme === 'dark';

        // Base classes for all days
        const baseClasses = `p-3 cursor-pointer text-center rounded-lg text-sm font-medium transition-all duration-200 ease-in-out`;

        // Today's highlight and selected day styles
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
                ref={(el) => (daysRef.current[index] = el)}
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
                className={`text-center font-semibold text-sm py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
                {day}
            </div>
        ));
    };

    const firstDayOfMonth = getDay(currentMonthStart);
    const lastRowPadding = (7 - (currentMonthDays.length + firstDayOfMonth) % 7) % 7;

    return (
        <div
            className={`rounded-xl shadow-lg w-full max-w-md mx-auto p-4 space-y-4 transition-colors ${theme === 'dark' ? 'bg-gray-900' : 'bg-white border border-gray-200'}`}
            style={{ minHeight: '250px' }}
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <button
                    className={`text-xl px-3 py-1 rounded-full transition ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                >
                    &lt;
                </button>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {format(currentMonthStart, 'MMMM yyyy')}
                </h3>
                <button
                    className={`text-xl px-3 py-1 rounded-full transition ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
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
                {currentMonthDays.map((day, index) => renderDay(day, index))}
                {Array.from({ length: lastRowPadding }).map((_, i) => (
                    <div key={`empty-end-${i}`} />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
