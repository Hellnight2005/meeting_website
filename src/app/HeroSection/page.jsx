"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import NavBar from "@/components/Navbar";
import CreateMeetingModal from "@/components/CreateMeetingModal";

export default function HeroSection() {
    const [projectName] = useState("webapp");
    const [modalOpen, setModalOpen] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const videoRef = useRef(null);

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
        <section className="bg-white dark:bg-zinc-900 text-black dark:text-white py-20 px-6 md:px-12 lg:px-24">
            <NavBar />

            {/* Optional Top Nav Title + CTA */}
            <nav className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-20">
                <div className="text-2xl font-bold tracking-tight">{projectName}</div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-[1.03] transition-transform"
                    >
                        Let’s Talk
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 pt-36 md:pt-48 gap-16 relative z-10">
                {/* Left Text */}
                <div className="w-full md:w-1/2 text-center md:text-left -mt-8 md:-mt-12 mb-6">
                    <h1
                        ref={titleRef}
                        className="text-[10vw] md:text-[4vw] font-extrabold leading-tight tracking-tight"
                    >
                        We Build Websites{" "}
                        <br className="hidden md:block" /> That Get You Noticed.
                    </h1>
                    <p
                        ref={descRef}
                        className="mt-4 text-lg md:text-xl text-zinc-800 dark:text-zinc-300 max-w-lg mx-auto md:mx-0"
                    >
                        <span className="text-black dark:text-white font-semibold">
                            Whether you're
                        </span>{" "}
                        a brand, creator, or business — we craft stunning web experiences
                        that convert.
                    </p>

                    {/* CTA */}
                    <div ref={ctaRef} className="mt-8">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-base font-semibold shadow-md hover:scale-105 transition-transform"
                        >
                            Book a Meeting
                        </button>
                    </div>
                </div>

                {/* Right Mockup + Video */}
                <div className="w-full md:w-1/2 flex justify-center mb-4 relative">
                    <div
                        ref={videoRef}
                        className="w-full max-w-[860px] aspect-[16/10] rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl bg-white dark:bg-zinc-900 overflow-hidden"
                    >
                        {/* Top Bar */}
                        <div className="bg-zinc-100 dark:bg-zinc-800 h-10 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-700">
                            <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        </div>

                        {/* Video */}
                        <video
                            src="/video/mockup_vido.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreateMeetingModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </section>
    );
}
