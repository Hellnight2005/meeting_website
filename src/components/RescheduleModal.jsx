"use client";

import React, { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import gsap from "gsap";
import { useMeetingContext } from "../constants/MeetingContext";
import { useUser } from "../constants/UserContext";
import Image from "next/image";
import toast from "react-hot-toast";

function RescheduleModal({ meetingId, onClose, onSave }) {
    const { meetingsData, refreshMeetings } = useMeetingContext();
    const { user, fetchUserByAdmin } = useUser();

    const meeting = meetingsData.find((m) => m.id === meetingId);
    const { selectDay, selectTime, userId, user_name, title } = meeting || {};

    const [selectedTime, setSelectedTime] = useState(selectTime || "02:00 PM");
    const [selectedDate, setSelectedDate] = useState(selectDay || "");
    const [targetUser, setTargetUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose?.();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user?.role === "admin" && meeting?.userId) {
                const fetchedUser = await fetchUserByAdmin(meeting.userId);
                if (fetchedUser) setTargetUser(fetchedUser);
            }
        };
        fetchUserDetails();
    }, [user, meeting, fetchUserByAdmin]);

    const hasChanges = () =>
        selectedTime !== selectTime || selectedDate !== selectDay;

    const handleSave = async () => {
        if (!selectedDate || !selectedTime || isSubmitting) return;

        setIsSubmitting(true);
        const payload = {
            selectDay: selectedDate.display || selectedDate,
            selectTime: selectedTime, // Correct time handling
        };

        console.log("Selected Date:", selectedDate);
        console.log("Selected Time:", selectedTime);
        console.log("Payload:", payload);

        try {
            const res = await fetch(`/api/meeting/reschedule/${meetingId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("✅ Meeting rescheduled successfully!");
                refreshMeetings();
                onSave?.({
                    ...meeting,
                    ...payload,
                    slot: 1,
                });
                onClose?.();
            } else {
                toast.error("❌ Failed to reschedule the meeting.");
            }
        } catch (error) {
            console.error("Reschedule failed", error);
            toast.error("⚠️ Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayUser = targetUser || user || {};
    const displayName = displayUser.displayName || user_name || "User";
    const profileImage = displayUser.photo;

    if (!meeting) {
        return (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
                Loading meeting details...
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-center text-3xl font-extrabold text-gray-800 dark:text-white mb-10 tracking-tight">
                    Reschedule Appointment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Left Section - User Info */}
                    <div className="modal-section space-y-6 text-gray-800 dark:text-white px-4">
                        <div className="flex items-center gap-4">
                            {profileImage ? (
                                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-300 shadow-md">
                                    <Image
                                        src={profileImage}
                                        alt={displayName}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-semibold rounded-full w-16 h-16 flex items-center justify-center shadow-md ring-2 ring-gray-300">
                                    {displayName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-xl">{displayName}</p>
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
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section - Calendar */}
                    <div className="modal-section bg-[#1e293b] rounded-2xl py-6 px-4 text-white shadow-lg">
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            highlightColor="bg-blue-500"
                        />
                    </div>

                    {/* Right Section - Time Picker */}
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
