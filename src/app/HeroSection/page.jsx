"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import NavBar from "@/components/Navbar";
import CreateMeetingModal from "@/components/CreateMeetingModal";
import ProfileTag from "@/components/Profile";
import { useUser } from "@/constants/UserContext";

export default function HeroSection() {
    const [projectName] = useState("webapp");
    const [modalOpen, setModalOpen] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const videoRef = useRef(null);

    const { user, logout } = useUser();

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        })
            .from(
                descRef.current,
                {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                },
                "-=0.6"
            )
            .from(
                ctaRef.current,
                {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                },
                "-=0.5"
            )
            .from(
                videoRef.current,
                {
                    y: 50,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out",
                },
                "-=0.8"
            );
    }, []);

    return (
        <section className="relative min-h-screen bg-white dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white overflow-hidden">
            {/* Top Nav & Profile */}
            <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-6 md:px-12 z-30">
                <div className="text-2xl font-bold tracking-tight text-white dark:text-white">
                    {projectName}
                </div>
                <div className="flex items-center gap-4">
                    <NavBar />
                    <ProfileTag
                        name={user?.displayName || "Guest"}
                        email={user?.email || "guest@example.com"}
                        avatarUrl={user?.photo || "/icons/inmated.svg"}
                        onLogout={logout}
                    />
                </div>
            </div>

            {/* Hero Content */}
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-16 pt-36 md:pt-48 relative z-10">
                {/* Left Text */}
                <div className="w-full md:w-1/2 text-center md:text-left -mt-6 md:-mt-12">
                    <h1
                        ref={titleRef}
                        className="text-[10vw] md:text-[4vw] font-extrabold leading-tight tracking-tight text-white drop-shadow-lg"
                    >
                        We Build Websites <br className="hidden md:block" /> That Get You Noticed.
                    </h1>
                    <p
                        ref={descRef}
                        className="mt-4 text-lg md:text-xl text-zinc-200 dark:text-zinc-300 max-w-lg mx-auto md:mx-0"
                    >
                        <span className="text-white font-semibold">Whether you're</span>{" "}
                        a brand, creator, or business — we craft stunning web experiences that convert.
                    </p>

                    <div ref={ctaRef} className="mt-8">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-base font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            Book a Meeting
                        </button>
                    </div>
                </div>

                {/* Right Video Mockup */}
                <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
                    <div
                        ref={videoRef}
                        className="w-full max-w-[860px] aspect-[16/10] rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl bg-white dark:bg-zinc-900 overflow-hidden"
                    >
                        <div className="bg-zinc-100 dark:bg-zinc-800 h-10 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-700">
                            <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        </div>
                        <video
                            src="/video/mockup_vido.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover brightness-100"
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreateMeetingModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </section>
    );
}
