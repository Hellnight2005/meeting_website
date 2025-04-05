import Calendar from '@/components/Calendar'
import TimePicker from '@/components/TimePicker'
import React from 'react'

function project() {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center py-10">
                <h1 className="text-3xl font-semibold mb-6">Calendar</h1>

                {/* Flex container for side-by-side layout */}
                <div className="flex justify-between w-full max-w-4xl">
                    <div className="w-1/2 pr-4">
                        <Calendar />
                    </div>
                    <div className="w-1/2 pl-4">
                        <TimePicker />
                    </div>
                </div>
            </div>

        </>
    )
}

export default project