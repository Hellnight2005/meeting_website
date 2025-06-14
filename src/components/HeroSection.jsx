"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "@/components/Navbar";
import CreateMeetingModal from "@/components/CreateMeetingModal";
import ProfileTag from "@/components/Profile";
import { useUser } from "@/constants/UserContext";
import Image from "next/image";

export default function HeroSection() {
    const [projectName] = useState("WebSthapana");
    const [modalOpen, setModalOpen] = useState(false);

    const titleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const videoRef = useRef(null);

    const { user, logout } = useUser();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

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

        gsap.to(titleRef.current, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: titleRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        gsap.to(descRef.current, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
                trigger: descRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        gsap.to(videoRef.current, {
            yPercent: 30,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
                trigger: videoRef.current,
                start: "top 80%",
                end: "bottom top",
                scrub: 0.8,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const projectImage = "/icons/logo.svg";
    const projectDisplay = projectImage ? (
        <div className="flex items-center gap-3">
            <Image
                src={projectImage}
                alt="WebSthapana Logo"
                width={250}
                height={40}
                className="drop-shadow-lg invert"
            />
        </div>
    ) : (
        <span className="text-2xl font-bold tracking-tight text-white">
            {projectName}
        </span>
    );

    return (
        <section className="relative min-h-screen bg-zinc-900 p-6 md:p-10 text-white overflow-hidden">
            {/* Top Nav & Profile */}
            <div className="absolute top-[-8] left-0 right-0 flex justify-between items-center px-6 md:px-10 z-30">
                <div>{projectDisplay}</div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex">
                        <NavBar />
                    </div>
                    <ProfileTag
                        name={user?.displayName || "Guest"}
                        email={user?.email || "guest@example.com"}
                        avatarUrl={user?.photo || "/icons/inmated.svg"}
                        onLogout={logout}
                    />
                </div>
            </div>

            {/* Hero Content */}
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-16 space-y-12 md:space-y-0 pt-36 md:pt-48 relative z-10">
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
                        className="mt-4 text-lg md:text-xl text-zinc-300 max-w-lg mx-auto md:mx-0"
                    >
                        <span className="text-white font-semibold">Whether you're</span>{" "}
                        a brand, creator, or business — we craft stunning web experiences that convert.
                    </p>

                    <div ref={ctaRef} className="mt-8">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-white text-black px-6 py-3 rounded-full text-base font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            Book a Meeting
                        </button>
                    </div>
                </div>

                {/* Right Video Mockup */}
                <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
                    <div
                        ref={videoRef}
                        className="w-full max-w-[860px] aspect-[16/10] rounded-2xl border border-zinc-700 shadow-2xl bg-zinc-900 overflow-hidden"
                    >
                        <div className="bg-zinc-800 h-10 flex items-center px-4 border-b border-zinc-700">
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
