"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Facebook, Instagram, Mail } from "lucide-react";
import { useUser } from "@/constants/UserContext";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const { user } = useUser();
    const userEmail = user?.email || "";
    const [email, setEmail] = useState(userEmail);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const footerRef = useRef(null);
    const columnRefs = useRef([]);
    const iconRefs = useRef([]);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!footerRef.current) return;

        // Animate footer container
        gsap.fromTo(
            footerRef.current,
            { autoAlpha: 0, y: 60 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                },
            }
        );

        // Animate columns staggered
        gsap.fromTo(
            columnRefs.current,
            { autoAlpha: 0, y: 50 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                },
            }
        );

        // Animate social icons
        gsap.fromTo(
            iconRefs.current,
            { scale: 0.6, autoAlpha: 0 },
            {
                scale: 1,
                autoAlpha: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                },
            }
        );

        // Animate form fields
        gsap.fromTo(
            inputRefs.current,
            { x: -30, autoAlpha: 0 },
            {
                x: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                },
            }
        );
    }, []);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !message) {
            setErrorMessage("Please fill in both fields.");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/email/SendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message }),
            });

            if (!response.ok) {
                throw new Error("Failed to send email");
            }

            alert("Your message has been sent!");
            setEmail("");
            setMessage("");
        } catch (error) {
            setErrorMessage(error.message || "Error sending message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer ref={footerRef} className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 py-16 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">

                {/* Left: Logo */}
                <div ref={el => (columnRefs.current[0] = el)} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">YourAgency</h2>
                </div>

                {/* Center: Socials */}
                <div ref={el => (columnRefs.current[1] = el)} className="flex flex-col items-center">
                    <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-6">
                        {[
                            { icon: <Facebook className="h-5 w-5" />, link: "https://facebook.com", color: "hover:bg-blue-600" },
                            { icon: <Instagram className="h-5 w-5" />, link: "https://instagram.com", color: "hover:bg-pink-500" },
                            { icon: <Mail className="h-5 w-5" />, link: `mailto:${userEmail}`, color: "hover:bg-green-500" },
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-3 rounded-full bg-zinc-800 ${item.color} transition`}
                                ref={el => (iconRefs.current[index] = el)}
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Contact Form */}
                <div ref={el => (columnRefs.current[2] = el)}>
                    <h4 className="text-xl font-semibold mb-4">Quick Contact</h4>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div className="text-red-400 text-sm bg-red-900 p-2 rounded">
                                {errorMessage}
                            </div>
                        )}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            ref={el => (inputRefs.current[0] = el)}
                            className="w-full bg-zinc-700 border border-zinc-600 focus:border-blue-500 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400 transition"
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Your Message"
                            ref={el => (inputRefs.current[1] = el)}
                            className="w-full bg-zinc-700 border border-zinc-600 focus:border-blue-500 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400 transition"
                        />
                        <button
                            type="submit"
                            ref={el => (inputRefs.current[2] = el)}
                            className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium shadow-md"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </button>
                    </form>

                    <div className="mt-6 text-xs text-center text-zinc-400 space-x-4">
                        <a href="/privacy-policy" className="hover:underline hover:text-blue-400 transition">
                            Privacy Policy
                        </a>
                        <span>|</span>
                        <a href="/terms-and-conditions" className="hover:underline hover:text-blue-400 transition">
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Message */}
            <div className="mt-12 text-center text-zinc-400 text-sm">
                Building innovative solutions for tomorrow.
            </div>

            {/* Copyright */}
            <div className="mt-4 border-t border-zinc-700 pt-6 text-center text-zinc-500 text-sm">
                © {new Date().getFullYear()} YourAgency. All rights reserved.
            </div>
        </footer>
    );
}
