// components/RescheduleForm.jsx
import React, { useState } from "react";

export default function RescheduleForm({ meeting, onClose, onSave }) {
    const [newDate, setNewDate] = useState(meeting.date);
    const [newTime, setNewTime] = useState(meeting.time);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedMeeting = { ...meeting, date: newDate, time: newTime };
        onSave(updatedMeeting);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Reschedule Meeting</h2>

            <div>
                <label className="block">New Date</label>
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block">New Time</label>
                <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Save
                </button>
            </div>
        </form>
    );
}
