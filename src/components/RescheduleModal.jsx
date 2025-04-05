"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function RescheduleModal({ meeting, onClose, onSave }) {
    const [date, setDate] = useState(meeting?.date ? new Date(meeting.date) : new Date());
    const [time, setTime] = useState(meeting?.time || "");

    const handleSubmit = () => {
        const updatedMeeting = { ...meeting, date, time };
        onSave(updatedMeeting);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-black">
                <h2 className="text-xl font-bold mb-4">Reschedule Meeting</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">New Date</label>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border bg-white text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">New Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            disabled={!date || !time}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
