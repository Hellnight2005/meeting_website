"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
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

    useEffect(() => {
        if (!footerRef.current) return;

        gsap.fromTo(
            footerRef.current,
            { autoAlpha: 0, y: 40 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
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

                {/* Left: Links or Logo */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">YourAgency</h2>
                    <p className="text-sm text-zinc-400">Building innovative solutions for tomorrow.</p>
                </div>

                {/* Center: Socials */}
                <div className="flex flex-col items-center">
                    <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-6">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-800 hover:bg-blue-600 transition">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-800 hover:bg-sky-400 transition">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-zinc-800 hover:bg-pink-500 transition">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href={`mailto:${userEmail}`} className="p-3 rounded-full bg-zinc-800 hover:bg-green-500 transition">
                            <Mail className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                {/* Right: Contact form */}
                <div>
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
                            className="w-full bg-zinc-700 border border-zinc-600 focus:border-blue-500 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400 transition"
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Your Message"
                            className="w-full bg-zinc-700 border border-zinc-600 focus:border-blue-500 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400 transition"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium shadow-md"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </button>
                    </form>

                    {/* Added Privacy Policy and Terms links here */}
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

            <div className="mt-12 border-t border-zinc-700 pt-6 text-center text-zinc-500 text-sm">
                © {new Date().getFullYear()} YourAgency. All rights reserved.
            </div>
        </footer>
    );
}
