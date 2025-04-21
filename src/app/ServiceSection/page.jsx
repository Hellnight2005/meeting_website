"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Globe,
    Brush,
    BarChart2,
    Settings,
    Brain,
    LineChart,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: <Globe size={40} />,
        title: "Website Creation",
        description:
            "Beautiful, high-performance websites tailored to your brand and goals.",
    },
    {
        icon: <Brush size={40} />,
        title: "UI/UX Design",
        description:
            "Modern, intuitive user interfaces that deliver seamless experiences.",
    },
    {
        icon: <BarChart2 size={40} />,
        title: "SEO Optimization",
        description:
            "We build with SEO in mind to help your content rank and grow traffic.",
    },
    {
        icon: <Settings size={40} />,
        title: "Backend Development",
        description:
            "Smart, scalable systems built with solid database and API logic.",
    },
    {
        icon: <Brain size={40} />,
        title: "Strategy & Consulting",
        description:
            "From discovery to deployment, we guide your digital roadmap.",
    },
    {
        icon: <LineChart size={40} />,
        title: "Analytics & Performance",
        description:
            "Data-driven insights to improve site speed, conversion & ROI.",
    },
];

export default function ServiceSection() {
    const sectionRef = useRef(null);
    const bubbleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    once: true,
                },
                opacity: 0,
                y: 60,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            });

            gsap.from(".heading", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
                opacity: 0,
                y: 40,
                duration: 1,
                ease: "power2.out",
            });

            gsap.to(bubbleRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
                y: 60,
                opacity: 1,
                ease: "power2.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative dark:bg-zinc-900 bg-white py-20 px-6 md:px-12 lg:px-24 text-white overflow-hidden"
        >
            {/* Background bubbles */}
            <div
                ref={bubbleRef}
                className="absolute inset-0 opacity-10 pointer-events-none z-0"
                aria-hidden="true"
            >
                <svg
                    className="w-full h-full"
                    viewBox="0 0 600 600"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g fill="none" stroke="currentColor" strokeWidth="0.3">
                        <circle cx="150" cy="150" r="40" />
                        <circle cx="400" cy="100" r="20" />
                        <circle cx="500" cy="300" r="50" />
                        <circle cx="100" cy="400" r="25" />
                        <circle cx="300" cy="500" r="30" />
                    </g>
                </svg>
            </div>

            {/* Heading */}
            <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
                <h2 className="heading text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-black dark:text-white">
                    What We Do
                </h2>
                <p className="heading text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
                    From sleek interfaces to powerful backend solutions — we’re your all-in-one digital
                    agency.
                </p>
            </div>

            {/* Service Cards */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {services.map(({ icon, title, description }, index) => (
                    <div
                        key={index}
                        className="card group transform transition duration-300 ease-out hover:scale-[1.03] hover:-rotate-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-10 text-center shadow-md hover:shadow-xl"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md group-hover:scale-110 transition-transform">
                                {icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 tracking-wide text-black dark:text-white">
                                {title}
                            </h3>
                            <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
