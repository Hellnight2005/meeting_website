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
        icon: <Globe size={40} color="white" />,
        title: "Website Creation",
        description:
            "We craft stunning, responsive websites that not only look great but work flawlessly across devices—designed to convert visitors into loyal customers.",
    },
    {
        icon: <Brush size={40} color="white" />,
        title: "UI/UX Design",
        description:
            "User-first design is at our core. We create smooth, intuitive digital experiences that keep your users engaged and coming back.",
    },
    {
        icon: <BarChart2 size={40} color="white" />,
        title: "SEO Optimization",
        description:
            "What good is a great website if no one sees it? We build and optimize your site to climb search engine rankings and attract organic traffic that grows over time.",
    },
    {
        icon: <Settings size={40} color="white" />,
        title: "Backend Development",
        description:
            "We build reliable, scalable backend systems that power your business—APIs, databases, and server logic—all tuned for performance and security.",
    },
    {
        icon: <Brain size={40} color="white" />,
        title: "Strategy & Consulting",
        description:
            "Need direction? We help businesses define their digital strategy, avoid pitfalls, and make tech decisions with confidence—from planning to execution.",
    },
    {
        icon: <LineChart size={40} color="white" />,
        title: "Analytics & Performance",
        description:
            "Numbers tell a story. We set up smart tracking and performance metrics so you can make informed decisions and boost your ROI effectively.",
    },
];


export default function ServiceSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
            });

            gsap.from(".heading", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    once: true,
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
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
                        className="card group relative overflow-hidden transform transition-all duration-300 ease-out border border-zinc-200 dark:border-zinc-700 rounded-3xl p-10 text-center shadow-md hover:scale-105 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-black dark:group-hover:bg-white"
                    >
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-white/40 dark:bg-white/20 backdrop-blur-md group-hover:bg-white dark:group-hover:bg-black transition-colors duration-300">
                            {icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 tracking-wide text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-100 text-sm leading-relaxed group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
