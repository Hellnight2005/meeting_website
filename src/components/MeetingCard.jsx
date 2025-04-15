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
    const { meetingsData, upcomingMeetingIds, lineupMeetingIds, loading, refreshMeetings } = useMeetingContext(); // Access the context data
    const [meeting, setMeeting] = useState(null); // Local state for holding the meeting data
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal open/close state

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

    // Function to handle deleting the meeting
    const deleteMeeting = async () => {
        try {
            const response = await fetch(`http://localhost:5000/meeting/meetings/${meeting._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Call the refreshMeetings function to reload the meetings data
                refreshMeetings(); // Refresh the meetings list
            }
        } catch (error) {
            console.error("Error deleting meeting:", error);
        }
    };

    // Function to handle approving the meeting
    const approveMeeting = async () => {
        try {
            const response = await fetch(`http://localhost:5000/meeting/approve-meeting/${meeting._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Call the refreshMeetings function to reload the meetings data
                refreshMeetings(); // Refresh the meetings list
                alert("Meeting approved successfully!");
            } else {
                alert("Failed to approve the meeting.");
            }
        } catch (error) {
            console.error("Error approving meeting:", error);
        }
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    // Handle saving the meeting (this could be a form submission or any other action)
    const handleSaveMeeting = (updatedMeeting) => {
        console.log("Meeting saved:", updatedMeeting);
        // Logic to save the updated meeting can go here
        handleCloseModal(); // Close the modal after saving
    };

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
                            onClick={() => setIsModalOpen(true)} // Open the modal when clicked
                        >
                            Reschedule
                        </button>
                        <button
                            className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                            onClick={deleteMeeting} // Call the deleteMeeting function when clicked
                        >
                            Delete
                        </button>
                    </>
                )}
                {type === "lineup" && lineupMeetingIds.includes(meeting._id) && (
                    <>
                        <button
                            className={`${buttonBase} bg-green-500 text-white hover:bg-green-600`}
                            onClick={approveMeeting} // Call the approveMeeting function when clicked
                        >
                            Approve
                        </button>
                        <button
                            className={`${buttonBase} bg-red-500 text-white hover:bg-red-600`}
                            onClick={deleteMeeting} // Call the deleteMeeting function when clicked
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>

            {/* Reschedule Modal */}
            {isModalOpen && (
                <RescheduleModal
                    meetingId={meeting._id} // Pass the meeting ID to the modal
                    onClose={handleCloseModal} // Pass the close handler to the modal
                    onSave={handleSaveMeeting} // Pass the save handler to the modal
                />
            )}
        </div>
    );
}
