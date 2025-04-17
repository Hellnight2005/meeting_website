import React, { useState, useEffect } from "react";
import { useMeetingContext } from "../constants/MeetingContext";
import RescheduleModal from "./RescheduleModal";

// Helper functions
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

    useEffect(() => {
        const found = meetingsData.find((m) => m._id === id);
        setMeeting(found);
    }, [id, meetingsData]);

    if (!meeting) return null;

    const timeOfDay = getTimeOfDay(meeting.selectTime);
    const bgColor = {
        morning: "bg-yellow-50",
        afternoon: "bg-blue-50",
        evening: "bg-purple-50",
    }[timeOfDay];

    const buttonBase = "px-4 py-2 rounded-full font-medium transition duration-200";

    const imageSrc = meeting.user_role === "Admin"
        ? "/icons/inmated.svg"
        : "/icons/client.svg";

    const formattedSlot = meeting.slot === "30" || meeting.slot === 30
        ? "30 minutes"
        : "1 hour";

    const deleteMeeting = async () => {
        try {
            const res = await fetch(`/api/meeting/delete/${meeting._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) refreshMeetings();
        } catch (err) {
            console.error("Error deleting meeting:", err);
        }
    };

    const approveMeeting = async () => {
        try {
            const res = await fetch(`/api/meeting/approve/${meeting._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                refreshMeetings();
            } else {
                alert("Failed to approve the meeting.");
            }
        } catch (err) {
            console.error("Error approving meeting:", err);
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveMeeting = () => {
        // Do something with updated meeting
        handleCloseModal();
    };

    const shouldShowReschedule = type === "upcoming" && upcomingMeetingIds.includes(meeting._id);
    const shouldShowApprove = type === "lineup" && lineupMeetingIds.includes(meeting._id);

    return (
        <div className={`border rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 ${bgColor}`}>
            <div className="flex items-center gap-4">
                <img
                    src={imageSrc}
                    alt="client"
                    className="w-14 h-14 rounded-full"
                />
                <div>
                    <h3 className="font-bold text-black text-lg">{meeting.user_name}</h3>
                    <p className="text-sm text-gray-900">{meeting.title}</p>
                </div>
            </div>

            <div className="mt-4 text-sm space-y-1 text-black">
                <p><strong>Day:</strong> {meeting.selectDay}</p>
                <p>
                    <strong>Time:</strong> {meeting.selectTime}
                    <span className="ml-2 inline-block bg-white border px-3 py-1 text-xs rounded-full shadow-sm">
                        ⏰ {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                    </span>
                </p>
                <p><strong>Slot:</strong> {formattedSlot}</p>
            </div>

            <div className="flex gap-4 mt-6">
                {shouldShowReschedule && (
                    <>
                        <button
                            className={`${buttonBase} bg-blue-500 text-white hover:bg-blue-600`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Reschedule
                        </button>
                        <button
                            className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                            onClick={deleteMeeting}
                        >
                            Delete
                        </button>
                    </>
                )}

                {shouldShowApprove && (
                    <>
                        <button
                            className={`${buttonBase} bg-green-500 text-white hover:bg-green-600`}
                            onClick={approveMeeting}
                        >
                            Approve
                        </button>
                        <button
                            className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                            onClick={deleteMeeting}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>

            {isModalOpen && (
                <RescheduleModal
                    meetingId={meeting._id}
                    onClose={handleCloseModal}
                    onSave={handleSaveMeeting}
                />
            )}
        </div>
    );
}
