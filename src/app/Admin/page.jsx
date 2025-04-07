"use client";
import React from "react";
import { useMeetingContext } from "../../constants/MeetingContext";
import MeetingList from "@/components/MeetingList";
import Charts from "@/components/Charts";

export default function Admin() {
    const { meetings, upcomingMeetingIds, lineupMeetingIds } = useMeetingContext();

    const upcomingMeetings = meetings.filter((m) => upcomingMeetingIds.includes(m.id));

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
                <MeetingList meetings={upcomingMeetings} type="upcoming" showSearchBar={false} visibleSlots={3} />

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
                    <Charts />
                </div>
            </div>
        </div>
    );
}
