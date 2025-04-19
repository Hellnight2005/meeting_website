// CombinedProviders.jsx
'use client';

import React from 'react';
import { useUser } from '@/constants/UserContext';
import { MeetingProvider } from '@/constants/MeetingContext';
import { AdminProvider } from '@/constants/AdminContext';

const CombinedProviders = ({ children }) => {
    const { user } = useUser();

    return (
        <MeetingProvider>
            {user?.role === 'admin' ? (
                <AdminProvider>{children}</AdminProvider>
            ) : (
                children
            )}
        </MeetingProvider>
    );
};

export default CombinedProviders;
