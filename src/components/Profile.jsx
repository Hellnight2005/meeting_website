"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";

const ProfileTag = ({ name, email, avatarUrl, onLogout }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative inline-block">
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt="Profile"
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-gray-700 hover:border-gray-400 transition duration-200"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 text-sm font-semibold">
                        {name?.[0] || "U"}
                    </div>
                )}
            </div>

            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-4 z-50">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">{name}</p>
                        <p className="text-xs text-gray-400 truncate">{email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="mt-4 flex items-center gap-2 w-full text-sm font-medium text-red-400 hover:text-red-300 transition"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileTag;
