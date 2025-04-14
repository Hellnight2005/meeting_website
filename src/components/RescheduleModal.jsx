"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import { format, parse } from "date-fns";
import gsap from "gsap";
import { useMeetingContext } from "../constants/MeetingContext"; // Import the MeetingContext

function RescheduleModal({ meetingId, onClose, onSave }) {
    const { meetingsData } = useMeetingContext(); // Access the meetingsData from context
    const meeting = meetingsData.find((m) => m._id === meetingId); // Find the meeting by ID

    const { selectDay, selectTime, user_name, slot, title } = meeting || {};
    const today = new Date();
    const formattedToday = format(today, "EEEE, MMMM d, yyyy");

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [isHalfHour, setIsHalfHour] = useState(slot === 30);

    const modalRef = useRef(null);
    const containerRef = useRef(null);

    // GSAP animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(modalRef.current, {
                opacity: 0,
                y: 50,
                scale: 0.95,
                duration: 0.6,
                ease: "power3.out",
            });

            gsap.from(".modal-section", {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.2,
                delay: 0.2,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose?.();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        if (selectDay) {
            try {
                const parsed = parse(selectDay, "EEEE, MMMM dd, yyyy", new Date());
                setSelectedDate({ raw: parsed });
            } catch (error) {
                console.error("Invalid selectDay format:", error);
            }
        }
    }, [selectDay]);

    useEffect(() => {
        if (selectTime) setSelectedTime(selectTime);
    }, [selectTime]);

    const hasChanges = () => {
        const formattedSelectedDay = selectedDate
            ? format(selectedDate.raw, "EEEE, MMMM dd, yyyy")
            : "";
        return selectedTime !== selectTime || formattedSelectedDay !== selectDay;
    };

    const handleSave = () => {
        const newDay = format(selectedDate.raw, "EEEE, MMMM dd, yyyy");
        const newTime = selectedTime;
        console.log("Saved changes:", { newDay, newTime });

        if (onSave) {
            onSave({
                ...meeting,
                selectDay: newDay,
                selectTime: newTime,
                slot: isHalfHour ? 30 : 60,
            });
        }

        onClose?.();
    };

    if (!meeting) {
        return <div>Loading...</div>; // Show a loading message if the meeting is not found
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        >
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-10 tracking-tight">
                    Reschedule Appointment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Left Panel */}
                    <div className="modal-section space-y-6 text-gray-800 px-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-semibold rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                                {user_name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-xl">{user_name}</p>
                                <p className="text-sm text-gray-500">{title}</p>
                            </div>
                        </div>

                        <div className="text-[15px] space-y-3 flex flex-col items-start">
                            <p className="flex items-center gap-2">
                                📅{" "}
                                <span className="font-medium">
                                    {selectedDate
                                        ? format(selectedDate.raw, "EEEE, MMMM dd, yyyy")
                                        : formattedToday}
                                </span>
                            </p>
                            <p className="flex items-center gap-2">
                                ⏱️ {slot === 30 || isHalfHour ? "30 Minutes" : "1 Hour"}
                            </p>
                            <p className="flex items-center gap-2">📍 Google Meet</p>

                            <div className="flex flex-col items-start space-y-2">
                                <p className="flex items-center gap-2 text-blue-600 font-medium">
                                    ⏰ {selectedTime || "02:00 PM"}
                                </p>

                                {hasChanges() && (
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Calendar Panel */}
                    <div className="modal-section bg-[#1e293b] rounded-2xl py-6 px-4 text-white shadow-lg">
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            highlightColor="bg-blue-500"
                        />
                    </div>

                    {/* Time Picker Panel */}
                    <div className="modal-section flex-1 overflow-y-auto pr-1 hide-scrollbar space-y-3">
                        <TimePicker
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                            isHalfHour={isHalfHour}
                            setIsHalfHour={setIsHalfHour}
                            slot={slot}
                            selectedDate={selectedDate}
                            currentMeetingId={meeting.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RescheduleModal;
