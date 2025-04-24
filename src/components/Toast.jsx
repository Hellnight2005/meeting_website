// Toast.js
import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(); // Hide toast after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup the timeout on unmount
    }, [message, onClose]);

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <p className="text-lg">{message}</p>
        </div>
    );
}
