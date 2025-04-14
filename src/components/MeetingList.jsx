"use client";
import React, { useState, useMemo } from "react";
import { useMeetingContext } from "../constants/MeetingContext"; // Import your MeetingContext
import MeetingCard from "./MeetingCard";

export default function MeetingList({ meetingIds = [], type, showSearchBar = true, visibleSlots }) {
    const { meetingsData } = useMeetingContext(); // Access meetingsData from context
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);

    // Filter and sort meetings based on meetingIds and selectDay, selectTime
    const filteredMeetings = useMemo(() => {
        // Filter meetings based on meetingIds and the meeting type (upcoming or line up)
        const meetingsForIds = meetingsData.filter(meeting => meetingIds.includes(meeting._id));

        // Sort the meetings by selectDay and selectTime
        const sorted = [...meetingsForIds].sort((a, b) => {
            const dateA = new Date(`${a.selectDay} ${a.selectTime}`);
            const dateB = new Date(`${b.selectDay} ${b.selectTime}`);
            return dateA - dateB; // Sort in ascending order
        });

        // Apply the search filter
        return sorted.filter(
            (meeting) =>
                meeting.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                meeting.selectDay.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [meetingsData, meetingIds, searchTerm]);

    const totalMeetings = filteredMeetings.length;
    const slotsPerPage = visibleSlots || totalMeetings; // default to all if not passed
    const totalPages = Math.ceil(totalMeetings / slotsPerPage);

    // Paginate the filtered meetings
    const paginatedMeetings = filteredMeetings.slice(
        page * slotsPerPage,
        (page + 1) * slotsPerPage
    );

    return (
        <div className="space-y-6">
            {/* 🔍 Optional Search Bar */}
            {showSearchBar && (
                <div className="w-full flex justify-start">
                    <div className="relative w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by name or day..."
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0); // Reset to first page on search
                            }}
                        />
                        <img
                            src="/icons/searchbar.svg" // Replace with your actual image path
                            alt="Search icon"
                            className="absolute left-3 top-3.5 w-5 h-5"
                        />
                    </div>
                </div>
            )}

            {/* 📋 Meeting Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMeetings.map((meeting) => (
                    <MeetingCard
                        key={meeting._id} // Use meeting._id as the key
                        id={meeting._id} // Pass the meeting._id
                        type={type}
                    />
                ))}
            </div>

            {/* ⛔ No results */}
            {!filteredMeetings.length && (
                <p className="text-gray-500 mt-4 text-center">No meetings found.</p>
            )}

            {/* 🔁 Pagination controls */}
            {visibleSlots && totalMeetings > visibleSlots && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-600">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
                        }
                        disabled={page + 1 >= totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
