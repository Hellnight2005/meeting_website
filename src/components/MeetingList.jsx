import React from "react";
import MeetingCard from "./MeetingCard";

export default function MeetingList({ title, meetings, type, onReschedule, onDelete, onApprove }) {
    const sortedMeetings = [...meetings].sort(
        (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    );

    return (
        <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {sortedMeetings.map(meeting => (
                    <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        type={type}
                        onReschedule={onReschedule}
                        onDelete={onDelete}
                        onApprove={onApprove}
                    />
                ))}
            </div>
        </section>
    );
}
