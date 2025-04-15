"use client";
import React, { useState } from "react";
import RescheduleModal from "@/components/RescheduleModal"; // Import your modal component

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

    return (
        <>
            {/* Render the button to open the modal */}
            <button onClick={handleOpenModal} className="btn-primary">
                Reschedule Meeting
            </button>

            {/* Display the RescheduleModal when it's open */}
            {isModalOpen && (
                <RescheduleModal
                    meetingId={"67fce07fa6de5c5740e4f332"}
                    onClose={handleCloseModal}
                    onSave={handleSaveMeeting}
                />
            )}
        </>
    );
}

export default Project;
