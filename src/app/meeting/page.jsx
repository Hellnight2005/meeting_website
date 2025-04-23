"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import ProfileTag from "@/components/Profile";
import { useUser } from "@/constants/UserContext";
import Link from "next/link";

function getTimeOfDay(timeStr) {
    const date = new Date(`1970-01-01T${convertTo24Hour(timeStr)}`);
    const hour = date.getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
}

function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}`;
}

function Meeting() {
    const [projectName] = useState("webapp");
    const [meeting, setMeeting] = useState(null);
    const [meetingExpired, setMeetingExpired] = useState(false);
    const [canJoin, setCanJoin] = useState(false);
    const { user, logout } = useUser();

    useEffect(() => {
        const getCookieValue = (name) => {
            const match = document.cookie.match(
                new RegExp("(^| )" + name + "=([^;]+)")
            );
            return match ? decodeURIComponent(match[2]) : null;
        };

        const decodeJWT = (token) => {
            try {
                const payload = token.split(".")[1];
                return JSON.parse(atob(payload));
            } catch {
                return null;
            }
        };

        const jwt = getCookieValue("meeting");
        const decoded = decodeJWT(jwt);
        const meetingId = decoded?.meetings?.[0];

        if (meetingId) {
            fetch(`/api/meeting/meeting_by_id/${meetingId}`)
                .then((res) => res.json())
                .then((data) => {
                    const fetchedMeeting = data.data;
                    if (!fetchedMeeting) {
                        setMeeting(null);
                        return;
                    }

                    const now = new Date();
                    const endTime = new Date(fetchedMeeting.endDateTime);
                    const startTime = new Date(fetchedMeeting.startDateTime);

                    const tenMinutesBefore = new Date(startTime.getTime() - 10 * 60 * 1000);
                    if (now >= tenMinutesBefore && now <= endTime) {
                        setCanJoin(true);
                    }

                    if (fetchedMeeting.type === "completed") {
                        document.cookie = "meeting=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        setMeeting(null);
                    } else {
                        if (
                            !fetchedMeeting.meetingLink &&
                            endTime < now &&
                            (fetchedMeeting.type === "line_up" || fetchedMeeting.type === "upcoming")
                        ) {
                            setMeetingExpired(true);
                        }
                        setMeeting(fetchedMeeting);
                    }
                })
                .catch(console.error);
        }
    }, []);

    if (!meeting) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 px-4 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4">No meeting currently lined up.</h2>
                <Link
                    href="/"
                    className="inline-block mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                >
                    Go to Homepage
                </Link>
            </div>
        );
    }

    const timeOfDay = getTimeOfDay(meeting.selectTime);
    const formattedSlot = meeting.slot === "30" || meeting.slot === 30 ? "30 minutes" : "1 hour";
    const imageSrc =
        meeting.user_role === "admin"
            ? "/icons/inmated.svg"
            : "/icons/client.svg";

    const stepLabels = ["Booked", "Line-Up", "Upcoming", "Completed"];
    const stepStatuses = ["booked", "line_up", "upcoming", "completed"];
    const currentStepIndex = stepStatuses.indexOf(meeting.type);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4 sm:px-8 md:px-12 relative">
            <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-6 md:px-12 z-30">
                <div className="text-2xl font-bold tracking-tight text-white">
                    {projectName}
                </div>
                <div className="flex items-center gap-4">
                    <NavBar />
                    <ProfileTag
                        name={user?.displayName || "Guest"}
                        email={user?.email || "guest@example.com"}
                        avatarUrl={user?.photo || "/icons/inmated.svg"}
                        onLogout={logout}
                    />
                </div>
            </div>

            <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-950 shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-6 sm:p-8 space-y-6 mt-28">
                <div className="flex items-center gap-4">
                    <img
                        src={imageSrc}
                        alt="client"
                        className="w-14 h-14 rounded-full border border-zinc-700 shadow-sm dark:invert"
                    />
                    <div>
                        <h3 className="font-bold text-white text-lg">{meeting.user_name}</h3>
                        <p className="text-sm text-zinc-300">{meeting.title}</p>
                    </div>
                </div>

                <div className="text-sm space-y-2 text-zinc-300">
                    <p><strong className="text-white">Day:</strong> {meeting.selectDay}</p>
                    <p>
                        <strong className="text-white">Time:</strong> {meeting.selectTime}
                        <span className="ml-2 inline-block bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs rounded-full shadow-sm">
                            ⏰ {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
                        </span>
                    </p>
                    <p><strong className="text-white">Slot:</strong> {formattedSlot}</p>
                    <p><strong className="text-white">Status:</strong> {meeting.type}</p>
                </div>

                {meetingExpired && (
                    <div className="p-3 bg-yellow-900 text-yellow-300 text-sm rounded-lg border border-yellow-600">
                        ⚠️ Admin has not approved the meeting yet.
                    </div>
                )}

                <div className="pt-4">
                    <div className="flex justify-between items-center text-xs font-medium text-zinc-400">
                        {stepLabels.map((label, index) => {
                            const isActive = currentStepIndex >= index;
                            return (
                                <div key={index} className="flex-1 text-center">
                                    <div
                                        className={`h-2 rounded-full mx-1 transition-all duration-300 ${isActive ? "bg-green-400" : "bg-zinc-700"}`}
                                    />
                                    <span className="block mt-1">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {meeting.type === "upcoming" && meeting.meetingLink && (
                    <div className="text-center pt-4">
                        <p className="text-sm text-zinc-300 mb-2">Your meeting is ready:</p>
                        <a
                            href={canJoin ? meeting.meetingLink : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-block ${canJoin
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-zinc-700 cursor-not-allowed"
                                } text-white font-semibold px-5 py-2.5 rounded-full shadow transition-colors`}
                            onClick={(e) => {
                                if (!canJoin) e.preventDefault();
                            }}
                        >
                            Join Meeting
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Meeting;
