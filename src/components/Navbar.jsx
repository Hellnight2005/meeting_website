"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Dot, X } from "lucide-react";
import { useUser } from "@/constants/UserContext";  // Assuming user context is available

const NavBar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const menuBox = useRef(null);
    const backdropRef = useRef(null);
    const itemRefs = useRef([]);
    const tl = useRef(null);

    const { user } = useUser();  // Getting user info from context

    const menuItems = ["Home", "Services", "Why Us", "How It Works", "Showcase", "Pricing"];
    const routeItems = ["/user", "#services", "#whyus", "#how", "#showcase", "#pricing"];

    // Conditionally add Admin link if the user is an admin
    if (user?.role === "admin") {
        menuItems.push("Admin");
        routeItems.push("/Admin");
    }

    itemRefs.current = [];

    const addToItemRefs = (el) => {
        if (el && !itemRefs.current.includes(el)) {
            itemRefs.current.push(el);
        }
    };

    useEffect(() => {
        if (open) {
            tl.current = gsap.timeline();
            gsap.set(backdropRef.current, { display: "block" });

            tl.current
                .fromTo(
                    backdropRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power1.out" }
                )
                .fromTo(
                    menuBox.current,
                    { x: 400, opacity: 0, scale: 0.8 },
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.5)",
                    },
                    "-=0.2"
                )
                .fromTo(
                    itemRefs.current,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.1,
                        ease: "back.out(1.7)",
                    },
                    "-=0.3"
                );
        } else {
            if (tl.current) {
                tl.current.reverse().eventCallback("onReverseComplete", () => {
                    gsap.set(backdropRef.current, { display: "none" });
                });
            }
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 hidden"
            />

            {/* Button and Menu Container */}
            <div
                ref={menuRef}
                className="relative z-50 w-full flex justify-end px-4"
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-4 py-2 mt-4 rounded-full 
                               bg-white dark:bg-[#0D0D0D] 
                               text-black dark:text-white font-semibold"
                >
                    {open ? "CLOSE" : "MENU"}
                    <div className="w-8 h-8 bg-[#E6EBED] dark:bg-[#1A1A1A] flex items-center justify-center rounded-full">
                        <div className="flex gap-1">
                            <Dot className="w-1 h-1 text-black dark:text-white" />
                            <Dot className="w-1 h-1 text-black dark:text-white" />
                        </div>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {open && (
                    <div
                        ref={menuBox}
                        className="absolute top-14 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 
                                   w-[90vw] sm:w-[320px] 
                                   bg-white dark:bg-[#1A1A1A] 
                                   text-black dark:text-white 
                                   p-6 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close button */}
                        <div className="flex justify-end">
                            <button onClick={() => setOpen(false)}>
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col gap-4 text-xl font-semibold mt-2 text-center sm:text-left items-center sm:items-start">
                            {menuItems.map((item, index) => {
                                const route = routeItems[index];

                                return (
                                    <div
                                        key={item}
                                        ref={addToItemRefs}
                                        className={`group flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg 
                                                    transition-transform duration-300
                                                    text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-black hover:text-black dark:hover:text-white`}
                                        style={{ transformOrigin: "center" }}
                                        onMouseEnter={(e) =>
                                            gsap.to(e.currentTarget, {
                                                scale: 1.2,
                                                duration: 0.25,
                                                ease: "power2.out",
                                            })
                                        }
                                        onMouseLeave={(e) =>
                                            gsap.to(e.currentTarget, {
                                                scale: 1,
                                                duration: 0.25,
                                                ease: "power2.inOut",
                                            })
                                        }
                                        onClick={(e) => {
                                            gsap.to(e.currentTarget, {
                                                scale: 1.2,
                                                duration: 0.25,
                                                ease: "bounce.out",
                                                onComplete: () => {
                                                    const target = document.getElementById(route.replace("#", ""));
                                                    if (target) {
                                                        target.scrollIntoView({
                                                            behavior: "smooth",
                                                            block: "start",
                                                        });
                                                    } else {
                                                        window.location.href = route;  // Use direct navigation for Admin link
                                                    }
                                                    setOpen(false);
                                                },
                                            });
                                        }}
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                                        <span>{item}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default NavBar;
