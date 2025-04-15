"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMeetingContext } from "../constants/MeetingContext";

const TimePicker = ({
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    highlightColor = "bg-blue-500",
}) => {
    const { blockedDays, refreshBlockedDays } = useMeetingContext(); // Always updated from context
    const timeRefs = useRef({});

    const didRun = useRef(false);

    useEffect(() => {
        if (!didRun.current) {
            refreshBlockedDays();
            didRun.current = true;
        }
    }, []);
    // Format the selected date to match the blockedDays keys
    const formattedSelectedDate = selectedDate?.display || "";

    // ⛔ Blocked times for that day
    const actualBlockedTimes = blockedDays[formattedSelectedDate] || [];

    // ⏰ Generate hourly time slots from 9 AM to 9 PM
    const timeSlots = useCallback(() => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
            const time = new Date(2020, 0, 1, hour, 0);
            const formatted = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? "PM" : "AM"
                }`;
            slots.push(formatted);
        }
        return slots;
    }, []);

    const timeSlotArray = timeSlots();

    // 🕘 Set default time when component loads or date changes
    useEffect(() => {
        if (!selectedTime && selectedDate) {
            const firstAvailable = timeSlotArray.find(
                (slot) => !actualBlockedTimes.includes(slot)
            );
            setSelectedTime(firstAvailable || null);
        }
    }, [selectedTime, selectedDate, actualBlockedTimes, setSelectedTime, timeSlotArray]);

    // ✅ Time selection handler
    const handleTimeSelect = (time) => {
        if (!actualBlockedTimes.includes(time)) {
            setSelectedTime(time);
            console.log("Selected Time:", time);
        }
    };

    return (
        <div className="time-picker-container p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Select a Time Slot</h2>
            <div className="time-slot-list overflow-auto max-h-96 bg-gray-700 rounded-lg p-2 hide-scrollbar">
                <div className="flex flex-col gap-2">
                    {timeSlotArray.map((time, index) => {
                        const isBlocked = actualBlockedTimes.includes(time);
                        const isSelected = selectedTime === time;

                        return (
                            <button
                                key={index}
                                ref={(el) => (timeRefs.current[time] = el)}
                                onClick={() => handleTimeSelect(time)}
                                disabled={isBlocked}
                                className={`py-2 px-4 rounded-lg text-center transition-all duration-200
                  ${isBlocked
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : isSelected
                                            ? `${highlightColor} text-white font-semibold shadow-lg`
                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
