"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useMeetingContext } from "../constants/MeetingContext";
import MeetingCard from "./MeetingCard";

export default function MeetingList({
    meetingIds = [],
    type,
    showSearchBar = true,
    visibleSlots
}) {
    const { meetingsData = [] } = useMeetingContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);

    const filteredMeetings = useMemo(() => {
        const term = searchTerm.toLowerCase();
        const meetingsForIds = meetingsData.filter((meeting) =>
            meetingIds.includes(meeting.id)
        );

        const sorted = [...meetingsForIds].sort((a, b) => {
            const dateA = new Date(`${a.selectDay} ${a.selectTime}`);
            const dateB = new Date(`${b.selectDay} ${b.selectTime}`);
            return dateA - dateB;
        });

        return sorted.filter(
            (meeting) =>
                meeting.user_name?.toLowerCase().includes(term) ||
                meeting.selectDay?.toLowerCase().includes(term)
        );
    }, [meetingsData, meetingIds, searchTerm.toLowerCase()]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm, meetingIds]);

    const totalMeetings = filteredMeetings.length;
    const slotsPerPage = visibleSlots || totalMeetings;
    const totalPages = Math.ceil(totalMeetings / slotsPerPage);

    const paginatedMeetings = filteredMeetings.slice(
        page * slotsPerPage,
        (page + 1) * slotsPerPage
    );

    return (
        <div className="space-y-6 text-gray-900">
            {showSearchBar && (
                <div className="w-full flex justify-start">
                    <div className="relative w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by name or day..."
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img
                            src="/icons/searchbar.svg"
                            alt="Search icon"
                            className="absolute left-3 top-3.5 w-5 h-5"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMeetings.map((meeting) => (
                    <MeetingCard
                        key={meeting.id}
                        id={meeting.id}
                        type={type}
                    // meeting={meeting} // optionally pass full meeting object
                    />
                ))}
            </div>

            {!filteredMeetings.length && (
                <p className="text-gray-500 mt-4 text-center italic">
                    No meetings found.
                </p>
            )}

            {visibleSlots && totalMeetings > visibleSlots && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-600">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage((prev) =>
                                prev + 1 < totalPages ? prev + 1 : prev
                            )
                        }
                        disabled={page + 1 >= totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
