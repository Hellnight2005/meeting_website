"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
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
                        <a href="mailto:hello@example.com">
                            <Mail className="hover:text-green-400 transition" />
                        </a>
                    </div>
                </div>

                {/* Right: Contact form */}
                <div>
                    <h4 className="text-xl font-semibold mb-4">Quick Contact</h4>
                    <form className="space-y-3">
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm placeholder-zinc-500 text-white"
                        />
                        <textarea
                            placeholder="Your Message"
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm placeholder-zinc-500 text-white"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Send
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
