"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Globe, Brush, BarChart2, Settings, Brain, LineChart } from "lucide-react";

const services = [
    { icon: Globe, title: "Website Creation", description: "Stunning, responsive websites that convert." },
    { icon: Brush, title: "UI/UX Design", description: "User-first design experiences that engage." },
    { icon: BarChart2, title: "SEO Optimization", description: "Rank higher, grow faster." },
    { icon: Settings, title: "Backend Development", description: "APIs, databases, performance-driven." },
    { icon: Brain, title: "Strategy & Consulting", description: "Digital clarity and execution." },
    { icon: LineChart, title: "Analytics & Performance", description: "Smarter decisions, better ROI." },
];

export default function ServiceSection() {
    const trackRef = useRef(null);
    const animRef = useRef(null);
    const headerRef = useRef(null);
    const [direction, setDirection] = useState(1);
    const loopedServices = [...services, ...services];

    useEffect(() => {
        gsap.fromTo(headerRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" });
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        animRef.current = gsap.to(track, { xPercent: -50, ease: "none", duration: 25, repeat: -1, paused: false });

        const handleScroll = (e) => {
            if (window.innerWidth <= 768) return;
            const dir = e.deltaY > 0 ? 1 : -1;
            if (dir !== direction) {
                setDirection(dir);
                animRef.current.timeScale(dir);
            }
        };

        window.addEventListener("wheel", handleScroll);
        track.addEventListener("touchstart", () => animRef.current.pause());
        track.addEventListener("touchend", () => animRef.current.play());

        return () => {
            animRef.current?.kill();
            window.removeEventListener("wheel", handleScroll);
            track.removeEventListener("touchstart", () => animRef.current.pause());
            track.removeEventListener("touchend", () => animRef.current.play());
        };
    }, [direction]);

    return (
        <section className="relative bg-zinc-900 text-white py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div ref={headerRef} className="max-w-7xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">What We Do</h2>
                <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                    From sleek interfaces to powerful backend solutions — we’re your all-in-one digital agency.
                </p>
            </div>
            <div className="overflow-hidden"
                onMouseEnter={() => animRef.current?.pause()}
                onMouseLeave={() => animRef.current?.play()}
            >
                <div ref={trackRef} className="flex gap-16 w-max" style={{ willChange: "transform" }}>
                    {loopedServices.map(({ icon: Icon, title, description }, i) => (
                        <div key={i} className="flex-shrink-0 w-80 text-center transition-transform duration-300 transform hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white"><Icon size={40} /></div>
                            <h3 className="text-xl font-semibold mb-3 tracking-wide">{title}</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
