"use client"
import React, { useState, useEffect } from "react";
import { useMeetingContext } from "../constants/MeetingContext";
import RescheduleModal from "./RescheduleModal";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";

const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}`;
};

const getTimeOfDay = (timeStr) => {
    const date = new Date(`1970-01-01T${convertTo24Hour(timeStr)}`);
    const hour = date.getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
};

export default function MeetingCard({ id, type }) {
    const {
        meetingsData,
        upcomingMeetingIds,
        lineupMeetingIds,
        completeMeetingIds,
        refreshMeetings,
    } = useMeetingContext();

    const [meeting, setMeeting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [isJoinEnabled, setIsJoinEnabled] = useState(false);

    useEffect(() => {
        const found = meetingsData.find((m) => m.id === id);
        setMeeting(found);
    }, [id, meetingsData]);

    useEffect(() => {
        const updateJoinStatus = () => {
            if (!meeting) return;
            const now = new Date();
            const meetingDateTime = new Date(`${meeting.selectDay} ${convertTo24Hour(meeting.selectTime)}`);
            const slotMinutes = meeting.slot === "30" || meeting.slot === 30 ? 30 : 60;
            const startWindow = new Date(meetingDateTime.getTime() - 5 * 60000);
            const endWindow = new Date(meetingDateTime.getTime() + slotMinutes * 60000);
            setIsJoinEnabled(now >= startWindow && now <= endWindow);
        };

        updateJoinStatus();
        const interval = setInterval(updateJoinStatus, 30000);
        return () => clearInterval(interval);
    }, [meeting]);

    if (!meeting) {
        return (
            <div className="p-6 border rounded-xl shadow animate-pulse bg-white h-48">
                <p className="text-gray-400">Loading meeting...</p>
            </div>
        );
    }

    const timeOfDay = getTimeOfDay(meeting.selectTime);
    const bgColor = {
        morning: "bg-yellow-50",
        afternoon: "bg-blue-50",
        evening: "bg-purple-50",
    }[timeOfDay];

    const imageSrc = meeting.user_role === "admin"
        ? "/icons/inmated.svg"
        : "/icons/client.svg";

    const formattedSlot = meeting.slot === "30" || meeting.slot === 30
        ? "30 minutes"
        : "1 hour";

    const isCompleted = type === "Completed" && completeMeetingIds.includes(meeting.id);
    const showRescheduleButtons = type === "upcoming" && upcomingMeetingIds.includes(meeting.id);
    const showApproveButtons = type === "line_up" && lineupMeetingIds.includes(meeting.id);

    const deleteMeeting = async () => {
        if (loadingAction) return;
        setLoadingAction("delete");

        try {
            const res = await fetch("/api/Meeting/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: meeting.id }), // Pass ID in body
            });

            if (res.ok) {
                await refreshMeetings();
                toast.success("Meeting deleted successfully.", { position: "top-center" });
            } else {
                toast.error("Failed to delete the meeting.", { position: "top-center" });
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.", { position: "top-center" });
        } finally {
            setLoadingAction(null);
        }
    };

    // approve meeting block req
    const approveMeeting = async () => {
        if (loadingAction) return;
        setLoadingAction("approve");
        try {
            console.log("meetingId", meeting.id);

            const res = await fetch(`/api/Meeting/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: meeting.id }),
            });

            const data = await res.json(); // 👈 Parse JSON response

            console.log("response from api", data);

            if (res.ok) {
                await refreshMeetings();
                toast.success("Meeting approved successfully.", { position: "top-center" });
            } else {
                toast.error(data?.error || "Failed to approve the meeting.", { position: "top-center" });
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.", { position: "top-center" });
        } finally {
            setLoadingAction(null);
        }
    }

    const handleJoinClick = () => {
        if (isJoinEnabled) {
            toast.success("The meeting is ready to join! You will be redirected shortly.", { position: "top-center" });
            setTimeout(() => {
                window.location.reload(); // This reloads the page after clicking "Join"
            }, 2000);
        } else {
            toast.error("The meeting isn't ready to join yet. Please wait until it's time.", { position: "top-center" });
        }
    };

    return (
        <div
            className={`border rounded-2xl shadow-lg p-6 transition duration-300 relative
            ${isCompleted ? "bg-gray-100 opacity-80 cursor-not-allowed" : bgColor}`}
        >
            {isCompleted && (
                <div className="absolute top-3 right-3 text-green-600 flex items-center gap-1">
                    <CheckCircle size={20} /> <span className="font-semibold">Completed</span>
                </div>
            )}

            <div className="flex items-center gap-4">
                <img
                    src={imageSrc}
                    alt="client"
                    className="w-14 h-14 rounded-full"
                />
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{meeting.user_name}</h3>
                    <p className="text-sm text-gray-700">{meeting.title}</p>
                </div>
            </div>

            <div className="mt-4 text-sm space-y-1 text-gray-800">
                <p><strong>Day:</strong> {meeting.selectDay}</p>
                <p>
                    <strong>Time:</strong> {meeting.selectTime}
                    <span className="ml-2 inline-block bg-white border px-3 py-1 text-xs rounded-full shadow-sm text-black">
                        ⏰ {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                    </span>
                </p>
                <p><strong>Slot:</strong> {formattedSlot}</p>
            </div>

            <div className="flex gap-4 mt-6 flex-wrap">
                {showRescheduleButtons && (
                    <>
                        {isJoinEnabled ? (
                            <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-block text-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                            >
                                ploJoin
                            </a>
                        ) : (
                            <button
                                disabled
                                className="px-4 py-2 rounded-full font-medium bg-gray-400 text-white cursor-not-allowed"
                                title="Join will be available 5 minutes before the meeting"
                            >
                                Join
                            </button>
                        )}
                        <button
                            className="px-4 py-2 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                            onClick={() => setIsModalOpen(true)}
                            disabled={!!loadingAction}
                        >
                            Reschedule
                        </button>
                        <button
                            className="px-4 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition duration-200"
                            onClick={deleteMeeting}
                            disabled={loadingAction === "delete"}
                        >
                            {loadingAction === "delete" ? "Deleting..." : "Delete"}
                        </button>
                    </>
                )}

                {showApproveButtons && (
                    <>
                        <button
                            className="px-4 py-2 rounded-full font-medium bg-green-600 text-white hover:bg-green-700 transition duration-200"
                            onClick={approveMeeting}
                            disabled={loadingAction === "approve"}
                        >
                            {loadingAction === "approve" ? "Approving..." : "Approve"}
                        </button>
                        <button
                            className="px-4 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition duration-200"
                            onClick={deleteMeeting}
                            disabled={loadingAction === "delete"}
                        >
                            {loadingAction === "delete" ? "Deleting..." : "Delete"}
                        </button>
                    </>
                )}
            </div>

            {isModalOpen && (
                <RescheduleModal
                    meetingId={meeting.id}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => {
                        setIsModalOpen(false);
                        refreshMeetings();
                    }}
                />
            )}
        </div>
    );
}
