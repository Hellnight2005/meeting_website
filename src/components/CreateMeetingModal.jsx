"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

    // Memoized default date/time strings
    const today = useMemo(() => new Date(), []);
    const defaultDay = useMemo(() => {
        return today.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }, [today]);
    const defaultTime = useMemo(() => {
        return today.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, [today]);

    // Form state
    const [brandName, setBrandName] = useState("");
    const [sector, setSector] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [description, setDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(defaultDay);
    const [selectedTime, setSelectedTime] = useState(defaultTime);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const [creatingMeeting, setCreatingMeeting] = useState(false);

    // Validate phone number with useCallback to avoid recreation
    const validatePhoneNumber = useCallback((value) => {
        const phoneRegex = /^[+\d\s\-()]{7,15}$/;
        if (!value) {
            setPhoneError("Phone number is required.");
            return false;
        }
        if (!phoneRegex.test(value)) {
            setPhoneError("Invalid phone number format.");
            return false;
        }
        setPhoneError("");
        return true;
    }, []);

    // Handle phone input change
    const handlePhoneChange = useCallback(
        (e) => {
            const val = e.target.value;
            setPhoneNumber(val);
            validatePhoneNumber(val);
        },
        [validatePhoneNumber]
    );

    // Animate modal on open
    useEffect(() => {
        if (!open) return;

        setAlreadyBooked(document.cookie.includes("meeting="));

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
    }, [open]);

    // Close modal on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    // Extract userId from token cookie
    const getUserFromToken = useCallback(() => {
        if (typeof window === "undefined") return null;
        try {
            const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
            if (!match) return null;
            const token = match[1];
            const payload = token.split(".")[1];
            const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
            const parsed = JSON.parse(decoded);
            return parsed?.userId || null;
        } catch (err) {
            console.error("Failed to decode token:", err);
            return null;
        }
    }, []);

    // Create meeting handler
    const handleCreate = useCallback(async () => {
        if (creatingMeeting) return;

        setCreatingMeeting(true);
        let currentUser = user;

        // Fetch user if not available
        if (!currentUser?.id) {
            const tokenUserId = getUserFromToken();
            if (!tokenUserId) {
                setShowLoginWarning(true);
                setCreatingMeeting(false);
                return;
            }
            try {
                const res = await fetch(`/api/user/fetch`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: tokenUserId }),
                });
                const userData = await res.json();
                if (userData?.User?.id) {
                    setUser(userData.User);
                    currentUser = userData.User;
                } else {
                    setShowLoginWarning(true);
                    setCreatingMeeting(false);
                    return;
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setShowLoginWarning(true);
                setCreatingMeeting(false);
                return;
            }
        }

        if (!currentUser?.id) {
            setShowLoginWarning(true);
            setCreatingMeeting(false);
            return;
        }

        // Construct payload
        const payload = {
            userId: currentUser.id,
            user_name: currentUser.displayName,
            selectDay: selectedDate?.display || selectedDate,
            selectTime: selectedTime,
            slot: 1,
            brandName: brandName.trim(),
            phoneNumber: phoneNumber.trim(),
            websiteUrl: websiteUrl.trim(),
            description: description.trim(),
        };

        try {
            const response = await fetch("/api/Meeting/creating_meeting", {
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
        } finally {
            setCreatingMeeting(false);
        }
    }, [
        creatingMeeting,
        user,
        getUserFromToken,
        setUser,
        selectedDate,
        selectedTime,
        brandName,
        phoneNumber,
        websiteUrl,
        description,
        onClose,
    ]);

    // Check if form can proceed
    const canProceed = useMemo(() => {
        return (
            brandName.trim() !== "" &&
            sector.trim() !== "" &&
            validatePhoneNumber(phoneNumber)
        );
    }, [brandName, sector, phoneNumber, validatePhoneNumber]);

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
                        <input
                            type="text"
                            placeholder="Brand/Business Name"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Sector (e.g., FinTech, Education)"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                        />
                        <input
                            type="url"
                            placeholder="Website URL (optional)"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className={`w-full bg-zinc-800 rounded-md px-4 py-2 text-white ${phoneError ? "border-red-500 border" : "border border-zinc-600"
                                }`}
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                        />
                        {phoneError && (
                            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                        )}
                        <textarea
                            placeholder="Brief Description"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-white resize-none"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button
                            onClick={() => canProceed && setShowForm(true)}
                            disabled={!canProceed}
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4 transition ${!canProceed ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            Next
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="modal-item text-white space-y-2">
                            <p>
                                <strong>Brand/Business:</strong> {brandName}
                            </p>
                            <p>
                                <strong>Sector:</strong> {sector}
                            </p>
                            {websiteUrl && (
                                <p>
                                    <strong>Website:</strong> {websiteUrl}
                                </p>
                            )}
                            <p>
                                <strong>Phone:</strong> {phoneNumber}
                            </p>
                            <p>
                                <strong>Description:</strong> {description}
                            </p>
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
                                disabled={creatingMeeting}
                                className={`${creatingMeeting
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                    } text-white font-semibold py-3 px-8 rounded-md transition`}
                            >
                                {creatingMeeting ? "Creating..." : "Create Meeting"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
