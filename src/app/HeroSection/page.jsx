"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import NavBar from "@/components/Navbar";

export default function HeroSection() {
    const [projectName] = useState("webapp");

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
        <section className="relative w-full min-h-screen bg-[#edf1f2] overflow-hidden">
            {/* Navbar */}
            <NavBar />

            <nav className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-20">
                <div className="text-2xl font-bold tracking-tight text-black">{projectName}</div>
                <div className="flex items-center gap-4">
                    <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-[1.03] hover:bg-[#111] transition-all">
                        Let’s Talk
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 pt-36 md:pt-48 gap-16 relative z-10">
                {/* Left Text Content */}
                <div className="w-full md:w-1/2 text-center md:text-left -mt-8 md:-mt-12 mb-6">
                    <h1
                        ref={titleRef}
                        className="text-[10vw] md:text-[4vw] font-extrabold text-black leading-tight tracking-tight"
                    >
                        We Build Websites <br className="hidden md:block" /> That Get You Noticed.
                    </h1>
                    <p
                        ref={descRef}
                        className="mt-4 text-lg md:text-xl text-gray-700 max-w-lg mx-auto md:mx-0"
                    >
                        <span className="text-[#4f46e5] font-semibold">Whether you're</span> a brand, creator, or business, we craft stunning web experiences that convert.
                    </p>

                    {/* CTA Button */}
                    <div ref={ctaRef} className="mt-8">
                        <Link href="/book">
                            <button className="bg-black text-white px-6 py-3 rounded-full text-base font-semibold shadow-md hover:scale-105 transition-transform">
                                Book a Meeting
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Right Mockup & Video */}
                <div className="w-full md:w-1/2 flex justify-center mb-4 relative">
                    <div
                        ref={videoRef}
                        className="w-full max-w-[860px] aspect-[16/10] rounded-2xl border border-black/10 shadow-2xl bg-white overflow-hidden"
                    >
                        {/* Top Bar */}
                        <div className="bg-[#f5f5f5] h-10 flex items-center px-4 border-b border-gray-300">
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
        </section>
    );
}
