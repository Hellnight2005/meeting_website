import React, { useState, useEffect, useRef } from "react";
import { format, addMinutes } from "date-fns";
import gsap from "gsap";
import { useMeetingContext } from "../constants/MeetingContext";

const TimePicker = ({
    selectedTime,
    setSelectedTime,
    isHalfHour,
    setIsHalfHour,
    highlightColor = "bg-blue-500",
    slot,
    selectedDate,
    currentMeetingId,
    setSelectedDate,
}) => {
    const timeRefs = useRef({});
    const [initialized, setInitialized] = useState(false);
    const [blockedTimes, setBlockedTimes] = useState([]);
    const [editableTimes, setEditableTimes] = useState([]);

    const { blockedDays } = useMeetingContext();

    const defaultDate = selectedDate || new Date();
    const normalizedDate = defaultDate?.raw instanceof Date ? defaultDate.raw : defaultDate;
    const formattedDateKey = format(normalizedDate, "EEEE, MMMM d, yyyy");

    useEffect(() => {
        if (!selectedTime) {
            setSelectedTime("10:00 PM");
        }
    }, [selectedTime, setSelectedTime]);

    useEffect(() => {
        if (!initialized) {
            setIsHalfHour(slot === 30);
            setInitialized(true);
        }
    }, [slot, initialized, setIsHalfHour]);

    const generateTimeSlots = () => {
        const interval = isHalfHour ? 30 : 60;
        const slots = [];
        let hour = 9;
        let minutes = 0;

        while (hour < 21 || (hour === 21 && minutes === 0)) {
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

    const expandBlockedSlots = (startTimeStr, slotCount) => {
        const start = new Date(`2020-01-01 ${startTimeStr}`);
        const times = [];
        for (let i = 0; i < slotCount; i++) {
            const t = addMinutes(start, i * 30);
            times.push(format(t, "hh:mm a"));
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        const blocked = [];
        const editable = [];
        const dayBlockedTimes = blockedDays[formattedDateKey] || {};

        Object.entries(dayBlockedTimes).forEach(([startTime, info]) => {
            const meetingId = info?.id;
            const meetingSlot = (info?.slot || 1) * 30; // default 30 mins if slot missing

            const slotCount = meetingSlot / 30;
            const slots = expandBlockedSlots(startTime, slotCount);

            slots.forEach((slotTime) => {
                if (currentMeetingId && currentMeetingId === meetingId) {
                    editable.push(slotTime);
                } else {
                    blocked.push(slotTime);
                }
            });
        });

        setBlockedTimes(blocked);
        setEditableTimes(editable);
    }, [formattedDateKey, blockedDays, currentMeetingId]);

    useEffect(() => {
        const el = timeRefs.current[selectedTime];
        if (el) {
            gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedTime, isHalfHour]);

    const handleTimeSelect = (time) => {
        if (!blockedTimes.includes(time) || editableTimes.includes(time)) {
            setSelectedTime(time);
        }
    };

    useEffect(() => {
        setSelectedDate(formattedDateKey);
    }, [formattedDateKey, setSelectedDate]);

    return (
        <div className="time-picker-container p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Select a Time Slot</h2>
                <button
                    onClick={() => setIsHalfHour(!isHalfHour)}
                    className="bg-blue-500 text-white px-3 py-1 text-xs rounded-full hover:bg-blue-600 transition"
                >
                    {isHalfHour ? "🕒 1-Hour" : "⏱️ 30-Min"}
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
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : isSelected
                                            ? `${highlightColor} text-white font-semibold shadow-lg`
                                            : isEditable
                                                ? `${highlightColor} text-white`
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
