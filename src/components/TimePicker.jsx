"use client";

import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';

const TimePicker = ({
    selectedTime,
    setSelectedTime,
    isHalfHour,
    setIsHalfHour,
    highlightColor = "bg-blue-500",
    slot
}) => {
    const timeRefs = useRef({});
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            if (slot === 30) setIsHalfHour(true);
            else if (slot === 60 || slot === 1) setIsHalfHour(false);
            setInitialized(true);
        }
    }, [slot, initialized, setIsHalfHour]);

    const generateTimeSlots = () => {
        const interval = isHalfHour ? 30 : 60;
        const slots = [];
        let hour = 9;
        let minutes = 0;

        while (hour < 21) {
            const time = new Date(2020, 0, 1, hour, minutes); // fixed date for consistency
            const formattedTime = format(time, 'hh:mm a'); // e.g., 04:30 PM
            slots.push(formattedTime);
            minutes += interval;
            if (minutes >= 60) {
                minutes = 0;
                hour += 1;
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        const el = timeRefs.current[selectedTime];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [selectedTime, isHalfHour]);

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    return (
        <div className="time-picker-container p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Select a Time Slot</h2>
                <button
                    onClick={() => setIsHalfHour(!isHalfHour)}
                    className="bg-blue-500 text-white px-3 py-1 text-xs rounded-full hover:bg-blue-600 transition"
                >
                    {isHalfHour ? "🕒 Switch to 1-hour" : "⏱️ Switch to 30-min"}
                </button>
            </div>

            <div className="time-slot-list overflow-auto max-h-96 bg-gray-700 rounded-lg p-2 hide-scrollbar">
                <div className="flex flex-col gap-2">
                    {timeSlots.map((time, index) => (
                        <button
                            key={index}
                            ref={(el) => (timeRefs.current[time] = el)}
                            onClick={() => handleTimeSelect(time)}
                            className={`py-2 px-4 rounded-lg text-center transition-all duration-200
                                ${selectedTime === time
                                    ? `${highlightColor} text-white font-semibold shadow-lg`
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
