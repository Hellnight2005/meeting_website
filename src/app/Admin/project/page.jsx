"use client";
import React, { useState } from "react";
import RescheduleModal from "@/components/RescheduleModal"; // Import your modal component
import CreateMeetingModal from "@/components/CreateMeetingModal"; import { useUser } from "../../../constants/UserContext"
import ProfilePopover from "@/components/Profile";

function Project() {



    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open the modal when clicking on Reschedule
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle saving the new meeting details
    const handleSaveMeeting = (updatedMeeting) => {
        console.log("Updated meeting details:", updatedMeeting);
        // You can send the updated meeting data to your API here
    };
    const handleLogout = () => {
        alert("logout ")
        console.log("Logging out...");
    };

    return (
        <>
            {/* <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                + Create Meeting
            </button> */}

            {/* <ProfilePopover
                name={user.name}
                email={user.email}
                avatarUrl={user.photo}
                onLogout={handleLogout}
            /> */}

            {/* <CreateMeetingModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            /> */}
        </>

    );
}

export default Project;
