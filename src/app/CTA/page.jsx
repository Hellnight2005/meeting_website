"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CreateMeetingModal from "@/components/CreateMeetingModal"; // Import the modal component

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
    const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility
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

    // Handle opening the modal
    const openModal = () => {
        setModalOpen(true);
    };

    // Handle closing the modal
    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <section className="dark:bg-zinc-900 py-20 px-6 md:px-12 lg:px-24 text-white">
            <div ref={ctaRef} className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Every project is unique. Let’s Meet
                </h2>
                <p className="text-lg mb-8 text-zinc-400">
                    Whether you have a full vision or just an idea, we’ll help bring it to life.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={openModal} // Open the modal on button click
                        className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
                    >
                        Book a Meeting
                    </button>
                </div>
            </div>

            {/* Render CreateMeetingModal component when modalOpen is true */}
            <CreateMeetingModal open={modalOpen} onClose={closeModal} />
        </section>
    );
}
