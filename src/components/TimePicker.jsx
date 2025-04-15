"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { useMeetingContext } from "../constants/MeetingContext"; // <-- adjust path if needed

const TimePicker = ({
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    highlightColor = "bg-blue-500",
    isHalfHour,
    setIsHalfHour,
}) => {
    const { blockedDays } = useMeetingContext(); // 🔥 get from context
    const timeRefs = useRef({});
    const [initialized, setInitialized] = useState(false);

    const timeSlots = useCallback(() => {
        const interval = isHalfHour ? 30 : 60;
        const slots = [];
        let hour = 9;
        let minutes = 0;

        while (hour < 21 || (hour === 21 && minutes === 0)) {
            const time = new Date(2020, 0, 1, hour, minutes);
            slots.push(format(time, "h:mm a"));
            minutes += interval;
            if (minutes >= 60) {
                minutes = 0;
                hour += 1;
            }
        }
        return slots;
    }, [isHalfHour]);

    const timeSlotArray = timeSlots();

    const formattedSelectedDate = format(new Date(selectedDate), "EEEE, MMMM d, yyyy");
    const actualBlockedTimes = blockedDays[formattedSelectedDate] || [];

    useEffect(() => {
        if (!selectedTime) {
            setSelectedTime(timeSlotArray[0]);
        }
    }, [selectedTime, setSelectedTime, timeSlotArray]);

    useEffect(() => {
        if (!selectedDate) return;
        setInitialized(true);
    }, [blockedDays, selectedDate]);

    const handleTimeSelect = (time) => {
        const isBlocked = actualBlockedTimes.includes(time);
        if (!isBlocked) {
            setSelectedTime(time);
        }
    };

    return (
        <div className="time-picker-container p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Select a Time Slot</h2>
            </div>

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
