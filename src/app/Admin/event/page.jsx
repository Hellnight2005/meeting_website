"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMeetingContext } from "@/constants/MeetingContext";
import MeetingList from "@/components/MeetingList";

export default function EventPage() {
    const { meetingsData, upcomingMeetingIds, lineupMeetingIds, completedMeetingIds } = useMeetingContext();
    const contentRef = useRef(null);

    useEffect(() => {
        if (typeof meetingsData !== "undefined") {
            gsap.from(contentRef.current, {
                opacity: 1,
                y: 30,
                duration: 1,
                ease: "power3.out",
            });
        }
    }, [meetingsData]);

    const upcomingMeetings = meetingsData?.filter((m) =>
        upcomingMeetingIds.includes(m.id)
    );
    const lineupMeetings = meetingsData?.filter((m) =>
        lineupMeetingIds.includes(m.id)
    );
    const completedMeetings = meetingsData?.filter((m) =>
        completedMeetingIds?.includes(m.id)
    );

    return (
        <div
            ref={contentRef}
            className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6 md:px-12"
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Event Dashboard
                </h1>

                {/* Upcoming Meetings Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                        ⏳ Upcoming Meetings
                    </h2>
                    {upcomingMeetings?.length === 0 ? (
                        <p className="text-gray-600 italic">No upcoming meetings found.</p>
                    ) : (
                        <MeetingList meetingIds={upcomingMeetingIds} type="upcoming" />
                    )}
                </section>

                {/* Lineup Meetings Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                        📌 Lineup Meetings
                    </h2>
                    {lineupMeetings?.length === 0 ? (
                        <p className="text-gray-600 italic">No lineup meetings found.</p>
                    ) : (
                        <MeetingList meetingIds={lineupMeetingIds} type="line_up" />
                    )}
                </section>

                {/* Completed Meetings Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        ✅ Completed Meetings
                    </h2>
                    {completedMeetings?.length === 0 ? (
                        <p className="text-gray-600 italic">No completed meetings found.</p>
                    ) : (
                        <MeetingList meetingIds={completedMeetingIds} type="completed" />
                    )}
                </section>
            </div>
        </div>
    );
}
