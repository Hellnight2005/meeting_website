// app/(auth)/login/page.js
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
                console.log("data", data);

                console.log("User Data", user);

                router.push('/Admin');
            } else {
                const data = await res.json();
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex w-full max-w-6xl">
                <div
                    ref={bgRef}
                    className="hidden md:block bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300"
                    style={{ width: '50%' }}
                ></div>

                <div ref={formRef} className="w-full md:w-1/2 p-10">
                    <div className="flex items-center mb-6">
                        <span className="font-bold text-xl">🏢 Basement</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                    <p className="text-gray-500 mb-6">Log in to access your dashboard</p>

                    <button
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg w-full hover:bg-gray-50"
                    >
                        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-400 text-sm">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-sm text-gray-600 mt-4">
                        Don’t have an account?{' '}
                        <Link href="/login" className="text-black font-semibold hover:underline">
                            Register Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
