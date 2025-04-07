'use client';

import Calendar from '@/components/Calendar';
import RescheduleModal from '@/components/RescheduleModal';
import TimePicker from '@/components/TimePicker';
import React, { useState } from 'react';

function Project() {
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal initially visible

    return (
        <>

            <h1 className='text-black font-bold'> Project page </h1>
        </>
    );
}

export default Project;
