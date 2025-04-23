import React, { useState, useEffect } from "react";
import { useMeetingContext } from "../constants/MeetingContext";
import RescheduleModal from "./RescheduleModal";
import toast from "react-hot-toast";

const getTimeOfDay = (timeStr) => {
    const date = new Date(`1970-01-01T${convertTo24Hour(timeStr)}`);
    const hour = date.getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
};

const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}`;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MeetingCard({ id, type }) {
    const {
        meetingsData,
        upcomingMeetingIds,
        lineupMeetingIds,
        refreshMeetings,
    } = useMeetingContext();

    const [meeting, setMeeting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    useEffect(() => {
        const found = meetingsData.find((m) => m.id === id);
        setMeeting(found);
    }, [id, meetingsData]);

    if (!meeting) return null;

    const timeOfDay = getTimeOfDay(meeting.selectTime);
    const bgColor = {
        morning: "bg-yellow-50",
        afternoon: "bg-blue-50",
        evening: "bg-purple-50",
    }[timeOfDay];

    const buttonBase = "px-4 py-2 rounded-full font-medium transition duration-200 disabled:opacity-50";

    const imageSrc = meeting.user_role === "admin"
        ? "/icons/inmated.svg"
        : "/icons/client.svg";

    const formattedSlot = meeting.slot === "30" || meeting.slot === 30
        ? "30 minutes"
        : "1 hour";

    const deleteMeeting = async () => {
        if (loadingAction) return;
        setLoadingAction("delete");
        try {
            const res = await fetch(`/api/meeting/delete/${meeting.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                refreshMeetings();
                toast.success("Meeting deleted successfully.");
            } else {
                toast.error("Failed to delete the meeting.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoadingAction(null);
        }
    };

    const approveMeeting = async () => {
        if (loadingAction) return;
        setLoadingAction("approve");
        try {
            const res = await fetch(`/api/meeting/approve/${meeting.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                await refreshMeetings();
                toast.success("Meeting approved successfully.");
            } else {
                const errorData = await res.json();
                console.error("Approval failed:", errorData);
                toast.error("Failed to approve the meeting.");
            }
        } catch (err) {
            console.error("Error approving meeting:", err);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);
    const handleSaveMeeting = () => handleCloseModal();

    const shouldShowReschedule = type === "upcoming" && upcomingMeetingIds.includes(meeting.id);
    const shouldShowApprove = type === "line_up" && lineupMeetingIds.includes(meeting.id);

    return (
        <div className={`border rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 ${bgColor}`}>
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
                <p><strong>Board:</strong> {meeting.board || "N/A"}</p>
            </div>

            <div className="flex gap-4 mt-6">
                {shouldShowReschedule && (
                    <>
                        <button
                            className={`${buttonBase} bg-blue-600 text-white hover:bg-blue-700`}
                            onClick={() => !loadingAction && setIsModalOpen(true)}
                            disabled={!!loadingAction}
                        >
                            Reschedule
                        </button>
                        <button
                            className={`${buttonBase} bg-red-600 text-white hover:bg-red-700`}
                            onClick={deleteMeeting}
                            disabled={loadingAction === "delete"}
                        >
                            {loadingAction === "delete" ? "Deleting..." : "Delete"}
                        </button>
                    </>
                )}

                {shouldShowApprove && (
                    <>
                        <button
                            className={`${buttonBase} bg-green-600 text-white hover:bg-green-700`}
                            onClick={approveMeeting}
                            disabled={loadingAction === "approve"}
                        >
                            {loadingAction === "approve" ? "Approving..." : "Approve"}
                        </button>
                        <button
                            className={`${buttonBase} bg-red-600 text-white hover:bg-red-700`}
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
                    onClose={handleCloseModal}
                    onSave={handleSaveMeeting}
                />
            )}
        </div>
    );
}
