import React, { useState, useEffect } from "react";
import { useMeetingContext } from "../constants/MeetingContext"; // Import the custom hook
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

export default function MeetingCard({ id, type }) {
    const { meetingsData, upcomingMeetingIds, lineupMeetingIds, loading } = useMeetingContext(); // Access the context data
    const [meeting, setMeeting] = useState(null); // Local state for holding the meeting data
    const [showModal, setShowModal] = useState(false);

    // Fetch the meeting details based on the provided id
    useEffect(() => {
        const foundMeeting = meetingsData.find((m) => m._id === id); // Find the meeting by its _id
        setMeeting(foundMeeting); // Set the meeting to state
    }, [id, meetingsData]);

    if (!meeting) return null; // If no meeting found, return null

    const timeOfDay = getTimeOfDay(meeting.selectTime);
    const bgColor = {
        morning: "bg-yellow-50",
        afternoon: "bg-blue-50",
        evening: "bg-purple-50",
    }[timeOfDay];

    const buttonBase = "px-4 py-2 rounded-full font-medium transition duration-200";

    // 🧑‍💼 Image based on role
    const imageSrc = meeting.user_role === "Admin"
        ? "/icons/inmated.svg"
        : "/icons/client.svg";

    // ⏳ Slot formatting
    const formattedSlot = meeting.slot === "30" || meeting.slot === 30
        ? "30 minutes"
        : "1 hour";

    return (
        <div className={`border rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 ${bgColor}`}>
            {/* Header Section with Profile */}
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

            {/* Meeting Details Section */}
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

            {/* Actions Section */}
            <div className="flex gap-4 mt-6">
                {type === "upcoming" && upcomingMeetingIds.includes(meeting._id) && (
                    <>
                        <button
                            className={`${buttonBase} bg-blue-500 text-white hover:bg-blue-600`}
                            onClick={() => setShowModal(true)}
                        >
                            Reschedule
                        </button>
                        <button
                            className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                            onClick={() => alert(`Deleted meeting ${meeting._id}`)}
                        >
                            Delete
                        </button>
                    </>
                )}
                {type === "lineup" && lineupMeetingIds.includes(meeting._id) && (
                    <>
                        <button
                            className={`${buttonBase} bg-green-500 text-white hover:bg-green-600`}
                            onClick={() => alert(`Approved meeting ${meeting._id}`)}
                        >
                            Approve
                        </button>
                        <button
                            className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                            onClick={() => alert(`Deleted meeting ${meeting._id}`)}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>

            {/* Reschedule Modal */}
            {showModal && (
                <RescheduleModal
                    meetingic={meeting._id}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
