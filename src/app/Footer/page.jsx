"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { useUser } from '@/constants/UserContext';  // Importing UserContext to access user data

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const { user } = useUser();  // Get user data from UserContext
    const userEmail = user?.email || "";  // Fallback to empty string if no email
    const [email, setEmail] = useState(userEmail);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // For error feedback
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

        setErrorMessage(""); // Clear previous error messages
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/email/SendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
        <footer ref={footerRef} className="bg-zinc-900 text-zinc-100 py-16">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                {/* Left: Links */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-zinc-400">
                        <li><a href="/" className="hover:text-white">Home</a></li>
                        <li><a href="/ServiceSection" className="hover:text-white">Services</a></li>
                        <li><a href="/work" className="hover:text-white">Our Work</a></li>
                        <li><a href="/book" className="hover:text-white">Book a Call</a></li>
                    </ul>
                </div>

                {/* Center: Socials */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <Facebook className="hover:text-blue-500 transition" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer">
                            <Twitter className="hover:text-sky-400 transition" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <Instagram className="hover:text-pink-500 transition" />
                        </a>
                        <a href={`mailto:${userEmail}`} className="hover:text-green-400 transition">
                            <Mail className="transition" />
                        </a>
                    </div>
                </div>

                {/* Right: Contact form */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">Quick Contact</h4>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div className="text-red-500 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm placeholder-zinc-500 text-white"
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm placeholder-zinc-500 text-white"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-12 text-center text-zinc-500 text-sm">
                © {new Date().getFullYear()} YourAgency. All rights reserved.
            </div>
        </footer>
    );
}

