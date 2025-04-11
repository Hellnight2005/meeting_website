"use client";

import React, { useEffect, useRef, useState } from 'react';
import { format, addMinutes, parse } from 'date-fns';
import { useMeetingContext } from "../constants/MeetingContext";
import gsap from 'gsap';

const TimePicker = ({
    selectedTime,
    setSelectedTime,
    isHalfHour,
    setIsHalfHour,
    highlightColor = "bg-blue-500",
    slot,
    selectedDate,
    currentMeetingId // 👈 Passed from parent
}) => {
    const timeRefs = useRef({});
    const [initialized, setInitialized] = useState(false);
    const [blockedTimes, setBlockedTimes] = useState([]);
    const [editableTimes, setEditableTimes] = useState([]); // 💙 editable (current meeting) slots

    const { getMeetingsByDay } = useMeetingContext();

    // Normalize selectedDate
    const normalizedDate = selectedDate?.raw instanceof Date ? selectedDate.raw : selectedDate;

    // Initialize slot format (30-min or 1-hour)
    useEffect(() => {
        if (!initialized) {
            setIsHalfHour(slot === 30);
            setInitialized(true);
        }
    }, [slot, initialized, setIsHalfHour]);

    // Create all time slots between 9AM and 9PM
    const generateTimeSlots = () => {
        const interval = isHalfHour ? 30 : 60;
        const slots = [];
        let hour = 9;
        let minutes = 0;

        while (hour < 21) {
            const time = new Date(2020, 0, 1, hour, minutes);
            const formattedTime = format(time, 'hh:mm a');
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

    // ⏱️ Block times for selectedDate + highlight currentMeeting slots
    useEffect(() => {
        if (!normalizedDate) return;

        const blocked = [];
        const editable = [];

        const dayMeetings = getMeetingsByDay(normalizedDate);
        console.log("📅 Meetings for selected date:", normalizedDate, dayMeetings);

        dayMeetings.forEach((meeting) => {
            try {
                if (!meeting.selectTime || typeof meeting.selectTime !== 'string') {
                    console.warn("Invalid or missing selectTime:", meeting);
                    return;
                }

                const start = parse(meeting.selectTime, 'hh:mm a', new Date(2020, 0, 1));
                const intervalCount = meeting.slot / (isHalfHour ? 30 : 60);

                for (let i = 0; i < intervalCount; i++) {
                    const timeStr = format(
                        addMinutes(start, i * (isHalfHour ? 30 : 60)),
                        'hh:mm a'
                    );

                    if (meeting.id === currentMeetingId) {
                        editable.push(timeStr); // 💙 allow & highlight
                    } else {
                        blocked.push(timeStr); // ❌ block
                    }
                }
            } catch (error) {
                console.warn("❌ Failed to parse meeting time:", meeting.selectTime, error);
            }
        });

        setBlockedTimes(blocked);
        setEditableTimes(editable); // 💙 store editable slots
    }, [normalizedDate, isHalfHour, getMeetingsByDay, currentMeetingId]);

    // Animate on time select
    useEffect(() => {
        const el = timeRefs.current[selectedTime];
        if (el) {
            gsap.to(el, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedTime, isHalfHour]);

    const handleTimeSelect = (time) => {
        if (!blockedTimes.includes(time) || editableTimes.includes(time)) {
            setSelectedTime(time);
        }
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
                    {timeSlots.map((time, index) => {
                        const isBlocked = blockedTimes.includes(time);
                        const isEditable = editableTimes.includes(time);
                        const isSelected = selectedTime === time;

                        return (
                            <button
                                key={index}
                                ref={(el) => (timeRefs.current[time] = el)}
                                onClick={() => handleTimeSelect(time)}
                                disabled={isBlocked && !isEditable}
                                className={`py-2 px-4 rounded-lg text-center transition-all duration-200
                                    ${isBlocked && !isEditable
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : isSelected
                                            ? `${highlightColor} text-white font-semibold shadow-lg`
                                            : isEditable
                                                ? `${highlightColor} text-white`
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
