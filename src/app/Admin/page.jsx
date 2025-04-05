"use client";
import React from "react";
import { useMeetingContext } from "../../constants/MeetingContext";
import UpcomingMeetings from "@/components/UpcomingMeetings";
import Charts from "@/components/Charts";

export default function Admin() {
    const { meetings } = useMeetingContext();
    const upcoming = meetings.filter((m) => m.type === "upcoming");

    const handleReschedule = (meeting) => alert(`Reschedule: ${meeting.title}`);
    const handleDelete = (meeting) => alert(`Delete: ${meeting.title}`);

    return (
        <div className="flex h-screen bg-gray-200 overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="bg-white/30 backdrop-blur-lg p-8 rounded-xl shadow-lg mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900">Welcome to Admin Panel</h1>
                    <p className="mt-2 text-gray-600">Here are your upcoming meetings:</p>
                </div>

                {/* ✅ Show upcoming meetings */}
                <UpcomingMeetings
                    meetings={upcoming}
                    onReschedule={handleReschedule}
                    onDelete={handleDelete}
                />

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
                    <Charts />
                </div>
            </div>
        </div>
    );
}
