"use client";
import React, { useEffect, useState } from "react";
import { useMeetingContext } from "../../../constants/MeetingContext";
import MeetingList from "@/components/MeetingList";
import RescheduleModal from "@/components/RescheduleModal";

export default function EventPage() {
    const { meetings, setMeetings } = useMeetingContext();
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    useEffect(() => {
        const fakeData = [{
            id: 1,
            title: "Project Kickoff",
            date: "2025-04-10",
            time: "10:00",
            type: "upcoming",
        },
        {
            id: 2,
            title: "Design Review",
            date: "2025-04-08",
            time: "14:30",
            type: "lineup",
        },
        {
            id: 3,
            title: "Client Sync",
            date: "2025-04-09",
            time: "16:00",
            type: "upcoming",
        },
        {
            id: 4,
            title: "Team Retrospective",
            date: "2025-04-12",
            time: "11:00",
            type: "lineup",
        },];
        setMeetings(fakeData);
    }, [setMeetings]);

    const handleReschedule = (meeting) => {
        setSelectedMeeting(meeting);
    };

    const handleRescheduleSave = (updatedMeeting) => {
        const updatedMeetings = meetings.map(m =>
            m.id === updatedMeeting.id ? updatedMeeting : m
        );
        setMeetings(updatedMeetings);
    };

    const handleDelete = (meeting) => alert(`Delete: ${meeting.title}`);
    const handleApprove = (meeting) => alert(`Approve: ${meeting.title}`);

    const upcoming = meetings.filter((m) => m.type === "upcoming");
    const lineup = meetings.filter((m) => m.type === "lineup");

    return (
        <div className="p-6 space-y-10">
            <MeetingList
                title="Upcoming Meetings"
                meetings={upcoming}
                type="upcoming"
                onReschedule={handleReschedule}
                onDelete={handleDelete}
            />
            <MeetingList
                title="Lineup Meetings"
                meetings={lineup}
                type="lineup"
                onReschedule={handleReschedule}
                onDelete={handleDelete}
                onApprove={handleApprove}
            />

            {selectedMeeting && (
                <RescheduleModal
                    meeting={selectedMeeting}
                    onClose={() => setSelectedMeeting(null)}
                    onSave={handleRescheduleSave}
                />
            )}
        </div>
    );
}
