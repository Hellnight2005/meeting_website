"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { CalendarDays } from "lucide-react";
import CreateMeetingModal from "@/components/CreateMeetingModal";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
    const [modalOpen, setModalOpen] = useState(false);
    const ctaRef = useRef(null);
    const headingRef = useRef(null);
    const paraRef = useRef(null);
    const buttonRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        if (!ctaRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
            },
        });

        tl.fromTo(
            ctaRef.current,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
            .from(
                headingRef.current,
                { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
                "-=0.3"
            )
            .from(
                paraRef.current,
                { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
                "-=0.4"
            )
            .from(
                buttonRef.current,
                { scale: 0.9, opacity: 0, duration: 0.5, ease: "back.out(1.7)" },
                "-=0.4"
            );

        if (iconRef.current) {
            gsap.to(iconRef.current, {
                y: -8,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }
    }, []);

    return (
        <section className="relative overflow-hidden bg-zinc-900 py-24 px-6 md:px-12 lg:px-24 text-white">
            {/* Background Blobs */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-0 left-1/2 transform -translate-x-1/2 animate-pulse-slow" />
                <div className="absolute w-72 h-72 bg-pink-500/20 rounded-full blur-2xl bottom-0 right-1/4 animate-pulse-slow" />
            </div>

            <div
                ref={ctaRef}
                className="max-w-3xl mx-auto text-center px-6 relative z-10"
            >
                <div ref={iconRef} className="flex justify-center mb-4">
                    <CalendarDays className="w-10 h-10 text-white opacity-70" />
                </div>

                <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-4">
                    Every project is unique. Let’s Meet
                </h2>
                <p ref={paraRef} className="text-lg mb-8 text-zinc-400">
                    Whether you have a full vision or just an idea, we’ll help bring it to
                    life.
                </p>
                <div className="flex justify-center">
                    <button
                        ref={buttonRef}
                        onClick={() => setModalOpen(true)}
                        className="group relative px-6 py-3 rounded-full border border-white text-white bg-transparent transition
                        hover:text-black hover:bg-white hover:shadow-xl overflow-hidden"
                        style={{ opacity: 1 }}
                    >
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:opacity-20 blur-lg transition duration-700 animate-glow pointer-events-none"
                        ></span>
                        <span className="relative z-10">Book a Meeting</span>
                    </button>
                </div>
            </div>

            <CreateMeetingModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </section>
    );
}
