import React from "react";

export default function MeetingCard({ meeting, type, onReschedule, onDelete, onApprove }) {
    const actionButtons = [
        {
            label: "Reschedule",
            onClick: () => onReschedule(meeting),
        },
        ...(type === "lineup"
            ? [{ label: "Approve", onClick: () => onApprove(meeting) }]
            : []),
        {
            label: "Delete",
            onClick: () => onDelete(meeting),
        }
    ];

    // Convert the date to a readable string
    const formattedDate = new Date(meeting.date).toLocaleDateString();
    const formattedTime = meeting.time;

    return (
        <div className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{meeting.title}</h3>
            <p className="text-sm text-gray-600">Date: {formattedDate}</p>
            <p className="text-sm text-gray-600 mb-3">Time: {formattedTime}</p>

            <div className="flex gap-2 flex-wrap">
                {actionButtons.map((btn, idx) => (
                    <button
                        key={idx}
                        onClick={btn.onClick}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
