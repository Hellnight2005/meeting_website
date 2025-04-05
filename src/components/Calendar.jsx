"use client";
import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay } from 'date-fns';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Track the currently displayed month
    const today = new Date();

    // Function to get days of a given month
    const getDaysOfMonth = (date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        return eachDayOfInterval({ start, end });
    };

    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthDays = getDaysOfMonth(currentMonthStart);

    const handleDayClick = (date) => {
        // Handle selecting a date if needed
        console.log(`Selected date: ${format(date, 'MMMM dd, yyyy')}`);
    };

    const handleNextMonthClick = () => {
        // Move to the next month when the button is clicked
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handlePreviousMonthClick = () => {
        // Move to the previous month when the button is clicked
        setCurrentMonth(addMonths(currentMonth, -1));
    };

    const renderDay = (date) => {
        const dayText = format(date, 'd');
        return (
            <div
                key={date}
                className={`p-4 cursor-pointer border rounded-lg text-center text-gray-200 transition-all ease-in-out duration-200
                ${isToday(date) ? 'bg-blue-600 text-white font-semibold' : ''} 
                hover:bg-blue-700 hover:text-white active:bg-blue-800 active:text-white`}
                onClick={() => handleDayClick(date)}
            >
                {dayText}
            </div>
        );
    };

    const getDayHeaders = () => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-gray-400 font-medium text-sm p-2">
                {day}
            </div>
        ));
    };

    // Get the first day of the current month to align the days correctly
    const firstDayOfMonth = getDay(currentMonthStart);

    return (
        <div className="flex flex-col items-center space-y-4 bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-md mx-auto">
            {/* Month Header with Navigation */}
            <div className="flex justify-between items-center w-full bg-gray-700 p-3 rounded-lg shadow-md">
                <button
                    className="text-white text-xl hover:bg-gray-600 p-2 rounded-full"
                    onClick={handlePreviousMonthClick}
                >
                    &lt; {/* Left arrow */}
                </button>
                <h3 className="text-xl font-semibold text-gray-200">{format(currentMonthStart, 'MMMM yyyy')}</h3>
                <button
                    className="text-white text-xl hover:bg-gray-600 p-2 rounded-full"
                    onClick={handleNextMonthClick}
                >
                    &gt; {/* Right arrow */}
                </button>
            </div>

            {/* Days of the week headers */}
            <div className="grid grid-cols-7 gap-1 mt-2">
                {getDayHeaders()}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mt-2">
                {/* Empty cells before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={index} className="text-center text-gray-600"></div>
                ))}

                {/* Days of the current month */}
                {currentMonthDays.map((day) => renderDay(day))}

                {/* Empty cells after the last day of the month */}
                {Array.from({ length: 7 - (currentMonthDays.length + firstDayOfMonth) % 7 }).map((_, index) => (
                    <div key={index} className="text-center text-gray-600"></div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
