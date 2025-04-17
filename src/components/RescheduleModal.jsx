"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import gsap from "gsap";
import { useMeetingContext } from "../constants/MeetingContext";

function RescheduleModal({ meetingId, onClose, onSave }) {
    const { meetingsData, refreshMeetings } = useMeetingContext();

    // Normalize IDs to ensure matching works
    const normalizedMeetings = meetingsData.map((m) => ({
        ...m,
        _id: m._id?.$oid || m._id,
        userId: m.userId?.$oid || m.userId,
    }));

    const meeting = normalizedMeetings.find((m) => m._id === meetingId);

    const { selectDay, selectTime, user_name, title } = meeting || {};
    const [selectedTime, setSelectedTime] = useState(selectTime || "");
    const [selectedDate, setSelectedDate] = useState(selectDay || "");

    const modalRef = useRef(null);
    const containerRef = useRef(null);

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose?.();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const hasChanges = () => {
        return selectedTime !== selectTime || selectedDate !== selectDay;
    };

    const handleSave = async () => {
        if (!selectedDate || !selectedTime) return;

        const newDay = selectedDate.display || selectedDate;
        const newTime = selectedTime;

        const rescheduleData = {
            selectDay: newDay,
            selectTime: newTime,
        };

        try {
            const response = await fetch(`/api/meeting/reschedule/${meetingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rescheduleData),
            });

            if (response.ok) {
                refreshMeetings();
                if (onSave) {
                    onSave({
                        ...meeting,
                        selectDay: newDay,
                        selectTime: newTime,
                        slot: 1,
                    });
                }
            }
        } catch (error) {
            console.error("Error rescheduling meeting:", error);
        }

        onClose?.();
    };

    if (!meeting) {
        return <div className="text-center py-10 text-gray-600">Loading meeting details...</div>;
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
                                📅
                                <span className="font-medium">
                                    {selectedDate?.display || selectedDate || new Date().toLocaleDateString()}
                                </span>
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

                    <div className="modal-section bg-[#1e293b] rounded-2xl py-6 px-4 text-white shadow-lg">
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            highlightColor="bg-blue-500"
                        />
                    </div>

                    <div className="modal-section flex-1 overflow-y-auto pr-1 hide-scrollbar space-y-3">
                        <TimePicker
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedTime={selectedTime}
                            setSelectedTime={setSelectedTime}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RescheduleModal;
