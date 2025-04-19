'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/constants/UserContext'; // or wherever your context is

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setUser, user } = useUser();

    useEffect(() => {
        const id = searchParams.get('id');

        if (id) {
            setUser({ id });
            router.replace('/');
        } else {
            router.replace('/login?error=missing_id');
        }
    }, [searchParams, setUser, router]);

    return <p>Signing you in with Google...</p>;
}
