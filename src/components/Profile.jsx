"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";

const ProfileTag = ({ name, email, avatarUrl, onLogout }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt="Profile"
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-gray-300 hover:border-white transition duration-200"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {name?.[0] || "U"}
                    </div>
                )}
            </div>

            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-50">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="mt-4 flex items-center gap-2 w-full text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
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
