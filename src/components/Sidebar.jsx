"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import adminLinks from "@/constants/adminLinks";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Sidebar = () => {
    const pathname = usePathname();
    const linksRef = useRef([]);

    useEffect(() => {
        // Initial animation when component mounts
        gsap.fromTo(
            linksRef.current,
            {
                opacity: 0,
                x: -30,
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power3.out",
            }
        );
    }, []);

    const handleMouseEnter = (index) => {
        gsap.to(linksRef.current[index], {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = (index) => {
        gsap.to(linksRef.current[index], {
            scale: 1,
            duration: 0.2,
            ease: "power2.inOut",
        });
    };

    return (
        <nav className="w-64 bg-white/20 backdrop-blur-md shadow-lg p-5">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">Admin Panel</h2>

            <ul className="space-y-4">
                {adminLinks.map(({ name, path, icon }, index) => (
                    <li
                        key={path}
                        ref={(el) => (linksRef.current[index] = el)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                    >
                        <Link
                            href={path}
                            className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 ${pathname === path
                                ? "bg-blue-600 text-white"
                                : "text-gray-800 hover:bg-blue-400/40 hover:text-blue-700"
                                }`}
                        >
                            <Image
                                src={icon}
                                alt={`${name} icon`}
                                width={20}
                                height={20}
                                className={`${pathname === path ? "filter invert" : ""}`}
                            />
                            <span>{name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;
