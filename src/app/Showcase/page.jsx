"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
    {
        title: "Creative Agency Website",
        image: "/showcase/agency.jpg", // grayscale recommended
    },
    {
        title: "SaaS Dashboard UI",
        image: "/showcase/saas.jpg",
    },
    {
        title: "E-commerce Landing Page",
        image: "/showcase/ecom.jpg",
    },
];

export default function Showcase() {
    const cardsRef = useRef([]);

    useEffect(() => {
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(
                card,
                { autoAlpha: 0, y: 40 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    delay: i * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                    },
                }
            );
        });
    }, []);

    return (
        <section className="dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-14">Showcase</h2>
                <div className="grid md:grid-cols-3 gap-10">
                    {showcaseItems.map((item, index) => (
                        <div
                            key={index}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="opacity-0 transform bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-56 object-cover filter grayscale hover:grayscale-0 transition duration-300"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
