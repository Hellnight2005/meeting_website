// components/Lineup.js
import React from "react";
import { useMeetingContext } from "../constants/MeetingContext";
import MeetingCard from "./MeetingCard"; // reuse card

const Lineup = ({ onReschedule, onDelete, onApprove }) => {
    const { appointments, lineup } = useMeetingContext();
    const filtered = appointments.filter(m => lineup.includes(m.id));

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Lineup Meetings</h2>
            <div className="space-y-4">
                {filtered.map(meeting => (
                    <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onReschedule={onReschedule}
                        onDelete={onDelete}
                        onApprove={onApprove}
                    />
                ))}
            </div>
        </div>
    );
};

export default Lineup;
