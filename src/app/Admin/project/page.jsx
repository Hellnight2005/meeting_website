import Calendar from '@/components/Calendar'
import RescheduleModal from '@/components/RescheduleModal'
import TimePicker from '@/components/TimePicker'
import React from 'react'

function project() {
    return (
        <>
            <RescheduleModal
                selectDay="Thursday, April 12, 2025"
                selectTime="05:00 PM"
                user_name="Jan Marshal"
                slot="1"
                title="Follow up meeting"
            />

        </>
    )
}

export default project