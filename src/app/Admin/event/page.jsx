"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMeetingContext } from "@/constants/MeetingContext";
import MeetingList from "@/components/MeetingList";

export default function EventPage() {
    const { meetings, upcomingMeetingIds, lineupMeetingIds } = useMeetingContext();

    const upcomingMeetings = meetings.filter((m) => upcomingMeetingIds.includes(m.id));
    const lineupMeetings = meetings.filter((m) => lineupMeetingIds.includes(m.id));

    const titleRef = useRef(null);
    const upcomingRef = useRef(null);
    const lineupRef = useRef(null);

    useEffect(() => {
        gsap.from(titleRef.current, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "power3.out",
        });

        gsap.from(upcomingRef.current, {
            opacity: 0,
            x: -50,
            duration: 1,
            delay: 0.5,
            ease: "power2.out",
        });

        gsap.from(lineupRef.current, {
            opacity: 0,
            x: 50,
            duration: 1,
            delay: 0.8,
            ease: "power2.out",
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 px-4 py-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <h1
                    ref={titleRef}
                    className="text-4xl font-bold mb-8 text-center text-gray-900"
                >
                    📅 Event Dashboard
                </h1>

                <section className="mb-12" ref={upcomingRef}>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        ⏳ Upcoming Meetings
                    </h2>
                    <MeetingList meetings={upcomingMeetings} type="upcoming" />
                </section>

                <section ref={lineupRef}>
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                        📌 Lineup Meetings
                    </h2>
                    <MeetingList meetings={lineupMeetings} type="lineup" />
                </section>
            </div>
        </div>
    );
}
