'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { UserContext } from '@/constants/UserContext';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const formRef = useRef(null);
    const bgRef = useRef(null);

    const { setUser, user } = useContext(UserContext);

    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set(bgRef.current, { width: '100%' });

        tl.to(bgRef.current, {
            width: '50%',
            duration: 1,
            ease: 'power2.out',
        }).fromTo(
            formRef.current,
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
            '-=0.5'
        );
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            displayName: form.name,
            email: form.email,
            password: form.password,
        };

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data);
                router.push('/Admin');
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    const handleGoogleSignIn = () => {
        router.push('/api/auth/google');
    };

    const handleNavigateToLogin = () => {
        router.push('/sign_up');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center transition-colors duration-300">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden flex w-full max-w-6xl">

                <div
                    ref={bgRef}
                    className="hidden md:block bg-gradient-to-br from-zinc-300 to-gray-400 dark:from-zinc-800 dark:to-zinc-700"
                    style={{ width: '50%' }}
                ></div>

                <div ref={formRef} className="w-full md:w-1/2 p-10">
                    <div className="flex items-center mb-6">
                        <span className="font-bold text-xl">🏢 Basement</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                        Keep your online business organized
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Sign up to start your 30 days free trial
                    </p>

                    <button
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg w-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                        <span className="mx-2 text-gray-400 text-sm">or</span>
                        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">
                                Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 dark:border-gray-600"
                                placeholder="Enter your name"
                            />
                        </div>
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
                                className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 dark:border-gray-600"
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
                                className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-zinc-800 dark:border-gray-600"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Already have an account?{' '}
                        <span
                            onClick={handleNavigateToLogin}
                            className="text-black dark:text-white font-semibold hover:underline cursor-pointer"
                        >
                            Login Here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
