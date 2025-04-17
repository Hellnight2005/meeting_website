"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMeetingContext } from "@/constants/MeetingContext";
import MeetingList from "@/components/MeetingList";
import { Button } from "@/components/ui/button";

export default function EventPage() {
    const { meetingsData, upcomingMeetingIds, lineupMeetingIds } = useMeetingContext();

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

    return (
        <div
            ref={contentRef}
            className="min-h-screen bg-gray-100 text-gray-800 px-4 py-6 md:px-12"
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    Event Dashboard
                </h1>

                {/* Upcoming Meetings Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-blue-600">
                            ⏳ Upcoming Meetings
                        </h2>
                        <Button>+ Create New Event</Button>
                    </div>
                    {upcomingMeetings?.length === 0 ? (
                        <p className="text-gray-500 italic">No upcoming meetings found.</p>
                    ) : (
                        <MeetingList meetingIds={upcomingMeetingIds} type="upcoming" />
                    )}
                </section>

                {/* Lineup Meetings Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                        📌 Lineup Meetings
                    </h2>
                    {lineupMeetings?.length === 0 ? (
                        <p className="text-gray-500 italic">No lineup meetings found.</p>
                    ) : (
                        <MeetingList meetingIds={lineupMeetingIds} type="line_up" />
                    )}
                </section>
            </div>
        </div>
    );
}
