"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMeetingContext } from "../constants/MeetingContext";

const TimePicker = ({
    selectedTime,
    setSelectedTime,
    selectedDate,
    highlightColor = "bg-blue-500",
}) => {
    const { blockedDays, refreshBlockedDays } = useMeetingContext();
    const timeRefs = useRef({});
    const didRun = useRef(false);

    useEffect(() => {
        if (!didRun.current) {
            refreshBlockedDays();
            didRun.current = true;
        }
    }, []);

    const formattedSelectedDate = selectedDate?.display || "";
    const rawBlockedTimes = blockedDays[formattedSelectedDate] || [];

    const timeSlots = useCallback(() => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
            const formatted = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? "PM" : "AM"}`;
            slots.push(formatted);
        }
        return slots;
    }, []);

    const timeSlotArray = timeSlots();

    // Extend blocked times to also block the next hour
    const extendedBlockedTimes = new Set(rawBlockedTimes);
    rawBlockedTimes.forEach((time) => {
        const index = timeSlotArray.indexOf(time);
        if (index >= 0 && index + 1 < timeSlotArray.length) {
            extendedBlockedTimes.add(timeSlotArray[index + 1]);
        }
    });

    useEffect(() => {
        if (!selectedTime && selectedDate) {
            const firstAvailable = timeSlotArray.find(
                (slot) => !extendedBlockedTimes.has(slot)
            );
            setSelectedTime(firstAvailable || null);
        }
    }, [selectedTime, selectedDate, extendedBlockedTimes, setSelectedTime, timeSlotArray]);

    const handleTimeSelect = (time) => {
        if (!extendedBlockedTimes.has(time)) {
            setSelectedTime(time);
        }
    };

    const getEndTime = (start) => {
        const index = timeSlotArray.indexOf(start);
        return index >= 0 && index + 1 < timeSlotArray.length
            ? timeSlotArray[index + 1]
            : null;
    };

    return (
        <div className="time-picker-container p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Select a Time Slot</h2>
            <div className="time-slot-list overflow-auto max-h-96 bg-gray-700 rounded-lg p-2 hide-scrollbar">
                <div className="flex flex-col gap-2">
                    {timeSlotArray.map((time, index) => {
                        const isBlocked = extendedBlockedTimes.has(time);
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

            {selectedTime && (
                <div className="mt-4 text-white text-center">
                    <p>
                        <strong>Meeting:</strong> {selectedTime} → {getEndTime(selectedTime) || "End of Day"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
