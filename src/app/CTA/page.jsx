"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PricingCTA() {
    const ctaRef = useRef(null);

    useEffect(() => {
        if (!ctaRef.current) return;

        gsap.fromTo(
            ctaRef.current,
            { autoAlpha: 0, y: 40 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                },
            }
        );
    }, []);

    return (
        <section className="dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white">
            <div ref={ctaRef} className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Every project is unique. Let’s chat.
                </h2>
                <p className="text-lg mb-8 text-zinc-400">
                    Whether you have a full vision or just an idea, we’ll help bring it to life.
                </p>
                <div className="flex justify-center">
                    <a
                        href="/book"
                        className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
                    >
                        Book a Meeting
                    </a>
                </div>
            </div>
        </section>
    );
}
