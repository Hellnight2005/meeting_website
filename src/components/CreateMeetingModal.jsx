"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import { useUser } from "@/constants/UserContext";
import { useRouter } from "next/navigation";

export default function CreateMeetingModal({ open, onClose }) {
    const modalRef = useRef(null);
    const containerRef = useRef(null);
    const { user, setUser } = useUser();
    const router = useRouter();

    const today = new Date();
    const defaultDay = today.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const defaultTime = today.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sector, setSector] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(defaultDay);
    const [selectedTime, setSelectedTime] = useState(defaultTime);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [alreadyBooked, setAlreadyBooked] = useState(false);

    // Check for meeting cookie presence when modal is open
    useEffect(() => {
        if (open) {
            const meetingCookieExists = document.cookie.includes("meeting=");
            setAlreadyBooked(meetingCookieExists); // Set state based on cookie existence

            const ctx = gsap.context(() => {
                gsap.from(modalRef.current, {
                    opacity: 0,
                    y: 40,
                    duration: 0.4,
                    ease: "power2.out",
                });
                gsap.from(".modal-item", {
                    opacity: 0,
                    y: 20,
                    stagger: 0.1,
                    delay: 0.1,
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [open]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    const getUserFromToken = () => {
        if (typeof window === "undefined") return null;
        try {
            const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
            const token = match?.[1];
            if (!token) return null;
            const payload = token.split(".")[1];
            const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
            const parsed = JSON.parse(decoded);
            return parsed?.userId || null;
        } catch (err) {
            console.error("Failed to decode token:", err);
            return null;
        }
    };

    const handleCreate = async () => {
        let currentUser = user;

        if (!currentUser?.id) {
            const tokenUserId = getUserFromToken();
            if (tokenUserId) {
                try {
                    const res = await fetch(`/api/user/${tokenUserId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });
                    const userData = await res.json();
                    if (userData?.User?.id) {
                        setUser(userData.User);
                        currentUser = userData.User;
                    } else {
                        setShowLoginWarning(true);
                        return;
                    }
                } catch (err) {
                    console.error("Failed to fetch user data:", err);
                    setShowLoginWarning(true);
                    return;
                }
            } else {
                setShowLoginWarning(true);
                return;
            }
        }

        if (!currentUser?.id) {
            setShowLoginWarning(true);
            return;
        }

        const fullTitle = `${title.trim()} - ${description.trim()} (Sector: ${sector.trim()})`;

        const payload = {
            userId: currentUser.id,
            user_name: currentUser.displayName,
            title: fullTitle,
            selectDay: selectedDate.display || selectedDate,
            selectTime: selectedTime,
            slot: 1,
        };

        try {
            const response = await fetch("/api/meeting/creating_meeting", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result?.success && result?.data?.id) {
                document.cookie = `meeting=${result.data.id}; path=/; max-age=${7 * 24 * 60 * 60}`;
            }

            onClose?.();
        } catch (err) {
            console.error("Failed to create meeting:", err);
        }
    };

    if (!open) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
        >
            <div
                ref={modalRef}
                className="bg-zinc-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Create a Meeting</h2>

                {alreadyBooked ? (
                    <div className="text-center space-y-4">
                        <p className="text-lg font-semibold text-green-400">
                            You've already booked a meeting.
                        </p>
                        <button
                            onClick={() => router.push("/meeting")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
                        >
                            Want to see?
                        </button>
                    </div>
                ) : showLoginWarning ? (
                    <div className="text-center space-y-4">
                        <p className="text-lg font-semibold text-red-500">
                            Please login first to create a meeting.
                        </p>
                        <button
                            onClick={() => setShowLoginWarning(false)}
                            className="bg-white text-black rounded px-4 py-2 font-medium"
                        >
                            Got it
                        </button>
                    </div>
                ) : user && user.type !== "google" ? (
                    <div className="text-center space-y-4">
                        <p className="text-lg font-semibold text-yellow-400">
                            Please login with Google to get meeting entry into your Google Calendar.
                        </p>
                        <button
                            onClick={() => router.push("/auth/google")}
                            className="bg-white text-black font-medium px-6 py-2 rounded hover:bg-gray-200 transition"
                        >
                            Login with Google
                        </button>
                    </div>
                ) : !showForm ? (
                    <div className="modal-item space-y-4">
                        <label className="block font-medium">
                            What's the meeting about?
                        </label>
                        <input
                            type="text"
                            placeholder="Enter meeting title"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Brief description"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Main sector (e.g., FinTech, Education)"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                        />
                        <button
                            onClick={() =>
                                title.trim() &&
                                description.trim() &&
                                sector.trim() &&
                                setShowForm(true)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 transition"
                        >
                            Next
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="modal-item text-white space-y-2">
                            <p className="text-lg font-medium">{title}</p>
                            <p>{description}</p>
                            <p className="italic text-sm text-blue-300">Sector: {sector}</p>
                            <p>📅 {selectedDate?.display || selectedDate}</p>
                            <p>⏰ {selectedTime}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="modal-item bg-zinc-800 p-4 rounded-xl shadow">
                                <Calendar
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    highlightColor="bg-blue-500"
                                />
                            </div>
                            <div className="modal-item">
                                <TimePicker
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    selectedTime={selectedTime}
                                    setSelectedTime={setSelectedTime}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleCreate}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
                            >
                                Create Meeting
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
