"use client";
import { useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        title: "Tell us what you need",
        description:
            "Share your vision, goals, and any references or ideas you have in mind.",
    },
    {
        title: "We design & develop",
        description:
            "Our team gets to work crafting a custom solution tailored to your needs.",
    },
    {
        title: "Review & Launch",
        description:
            "We polish the final product together, then launch it to the world.",
    },
];

export default function HowItWorks() {
    const stepRefs = useRef([]);

    useEffect(() => {
        stepRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.fromTo(
                el,
                { autoAlpha: 0, y: 40 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    delay: i * 0.2,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                }
            );
        });
    }, []);

    return (
        <section className="bg-white dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-14">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            ref={(el) => (stepRefs.current[index] = el)}
                            className="opacity-0 transform bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 shadow-sm transition-all"
                        >
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-black dark:bg-white text-white dark:text-black rounded-full mb-4">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{`Step ${index + 1
                                }: ${step.title}`}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
