"use client"
import React, { useState } from 'react';

const TimePicker = () => {
    const [selectedTime, setSelectedTime] = useState(""); // To store selected time
    const [isHalfHour, setIsHalfHour] = useState(true); // Toggle between 30 min and 1 hour slots

    // Function to generate time slots for a single day (e.g., from 9 AM to 9 PM)
    const generateTimeSlots = () => {
        const slots = [];
        let hour = 9; // Start at 9 AM
        let minutes = 0;

        // Generate slots based on selected interval (30 min or 1 hour)
        const interval = isHalfHour ? 30 : 60;

        // Create time slots for a single day (from 9 AM to 9 PM)
        while (hour < 21) { // Stop at 9 PM
            const time = new Date(0, 0, 0, hour, minutes, 0);

            // Format the time in Indian Standard Time (IST) using toLocaleTimeString with 'Asia/Kolkata' timezone
            const formattedTime = time.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata'
            });

            slots.push(formattedTime);

            minutes += interval;

            // If it's 60 minutes, increase the hour
            if (minutes === 60) {
                minutes = 0;
                hour += 1;
            }
        }

        return slots;
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        console.log(`Selected Time: ${time}`);
    };

    const toggleInterval = () => {
        setIsHalfHour(!isHalfHour); // Toggle between 30 min and 1 hour
    };

    const timeSlots = generateTimeSlots();

    return (
        <div className="time-picker-container p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-center text-gray-200 text-2xl font-semibold">Select a Time Slot</h3>
                <button
                    onClick={toggleInterval}
                    className="text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-all"
                >
                    {isHalfHour ? 'Switch to 1h' : 'Switch to 30min'}
                </button>
            </div>

            {/* Time slots container with hidden scrollbar */}
            <div
                className="time-slot-list overflow-auto max-h-96 bg-gray-700 rounded-lg p-2"
                style={{
                    scrollbarWidth: 'none', /* For Firefox */
                    msOverflowStyle: 'none', /* For IE 10+ */
                }}
            >
                <div className="flex flex-col gap-2">
                    {timeSlots.map((time, index) => (
                        <button
                            key={index}
                            onClick={() => handleTimeSelect(time)}
                            className={`py-2 px-4 rounded-lg text-center text-gray-800 bg-gray-200 hover:bg-gray-300 transition-all duration-200 
                            ${selectedTime === time ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Display the selected time */}
            {selectedTime && (
                <div className="mt-4 text-center text-gray-200">
                    <p className="font-medium">You selected: {selectedTime}</p>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
