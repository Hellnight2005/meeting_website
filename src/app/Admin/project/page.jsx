"use client"
import React, { useState } from 'react';

import TimePicker from '@/components/TimePicker';

function Project() {
    const [selectedTime, setSelectedTime] = useState("12:30 PM");  // Initial state for selected time
    const [isHalfHour, setIsHalfHour] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Saturday, April 12, 2025"); // Set initial date to current date


    return (
        <>
            <TimePicker
                selectedDate={selectedDate}  // Pass selectedDate as prop
                setSelectedDate={setSelectedDate}  // Pass setSelectedDate to allow updates
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                isHalfHour={isHalfHour}
                setIsHalfHour={setIsHalfHour}

            />
        </>
    );
}

export default Project;
