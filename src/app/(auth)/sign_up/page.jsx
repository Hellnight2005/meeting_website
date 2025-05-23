'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '@/constants/UserContext';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

export default function LoginPage() {
    const router = useRouter();
    const { setUser, user } = useContext(UserContext);
    const [form, setForm] = useState({ email: '', password: '' });
    const formRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set(bgRef.current, { width: '100%' });
        tl.to(bgRef.current, {
            width: '50%',
            duration: 1,
            ease: 'power2.inOut',
        }).fromTo(
            formRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
            '-=0.5'
        );
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setUser({ ...data.user, token: data.token });
                router.push('/Admin');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const handleGoogleSignIn = () => {
        router.push('/api/auth/google');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors">
            <div className="rounded-3xl shadow-xl overflow-hidden flex w-full max-w-6xl border dark:border-neutral-800">
                <div
                    ref={bgRef}
                    className="hidden md:block bg-neutral-100 dark:bg-neutral-900"
                    style={{ width: '50%' }}
                ></div>

                <div ref={formRef} className="w-full md:w-1/2 p-10">
                    <div className="flex items-center mb-6">
                        <span className="font-bold text-xl text-black dark:text-white">🏢 Basement</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">
                        Welcome back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Log in to access your dashboard
                    </p>

                    <button
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-2 border dark:border-neutral-700 px-4 py-2 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                        <span className="text-black dark:text-white">Sign in with Google</span>
                    </button>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300 dark:border-neutral-700" />
                        <span className="mx-2 text-gray-400 text-sm">or</span>
                        <hr className="flex-grow border-gray-300 dark:border-neutral-700" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-black dark:text-white">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white border-gray-300 dark:border-neutral-700"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-black dark:text-white">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white border-gray-300 dark:border-neutral-700"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Don’t have an account?{' '}
                        <Link href="/login" className="text-black dark:text-white font-semibold hover:underline">
                            Register Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
