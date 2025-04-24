"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import ProfileTag from "@/components/Profile";
import { useUser } from "@/constants/UserContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

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
    const [canJoin, setCanJoin] = useState(false);
    const [meetingStatus, setMeetingStatus] = useState(null);
    const { user, logout } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [hasHandledCompleted, setHasHandledCompleted] = useState(false);
    const [prevStatus, setPrevStatus] = useState(null);
    const [hasReloaded, setHasReloaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
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

    let isMarkingComplete = false;

    const fetchMeetingData = async (meetingId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/meeting/meeting_by_id/${meetingId}`);
            const data = await res.json();
            const fetchedMeeting = data.data;
            if (!fetchedMeeting) return;

            const now = new Date();
            const endTime = new Date(fetchedMeeting.endDateTime);
            const startTime = new Date(fetchedMeeting.startDateTime);
            const canJoinWindowStart = new Date(startTime.getTime() - 5 * 60 * 1000);
            const isWithinJoinTime = now >= canJoinWindowStart && now < endTime;

            setCanJoin(isWithinJoinTime);
            setMeeting(fetchedMeeting);

            const isAlreadyCompleted = fetchedMeeting.type === "completed";
            const hasEnded = now >= endTime;
            const hasMeetingLink = Boolean(fetchedMeeting.meetingLink);

            if ((isAlreadyCompleted || hasEnded) && hasMeetingLink && !isMarkingComplete) {
                isMarkingComplete = true;

                try {
                    const res = await fetch(`/api/meeting/markComplete`, {
                        method: "POST",
                        body: JSON.stringify({ meetingId }),
                        headers: { "Content-Type": "application/json" },
                    });

                    const result = await res.json();

                    if (res.ok && result.success) {
                        setMeetingStatus("completed");

                        await Promise.all([
                            fetch(`/api/exportMeetings?id=${meetingId}`),
                            fetch(`/api/meeting/delete/${meetingId}`, { method: "DELETE" }),
                        ]);

                        document.cookie = "meeting=; path=/; max-age=0;";
                        setMeeting(null);
                        toast.success("✅ The meeting is complete. You can now book a new one!");
                        setTimeout(() => router.push("/thank-you"), 2500);
                    } else {
                        console.warn("Failed to mark meeting as complete");
                    }
                } catch (err) {
                    console.error("Error marking meeting complete:", err);
                } finally {
                    isMarkingComplete = false;
                }
            } else if (fetchedMeeting.type === "line_up") {
                setMeetingStatus("line_up");
            } else if (fetchedMeeting.type === "upcoming") {
                setMeetingStatus("upcoming");
            }
        } catch (err) {
            console.error("Error fetching meeting data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const urlMeetingId = searchParams.get("meetingId");
        let meetingId = urlMeetingId;

        if (!meetingId) {
            const jwt = getCookieValue("meeting");
            const decoded = decodeJWT(jwt);
            meetingId = decoded?.meetings?.[0];
        }

        if (!meetingId) {
            console.warn("No meeting ID found.");
            setIsLoading(false);
            return;
        }

        fetchMeetingData(meetingId);
        const interval = setInterval(() => fetchMeetingData(meetingId), 30000);

        return () => clearInterval(interval);
    }, [searchParams]);

    useEffect(() => {
        const handleCompletedMeeting = async () => {
            if (!meeting || hasHandledCompleted || meeting.type !== "completed") return;

            try {
                await Promise.all([
                    fetch(`/api/exportMeetings?id=${meeting.id}`),
                    fetch(`/api/meeting/delete/${meeting.id}`, { method: "DELETE" }),
                ]);

                document.cookie = "meeting=; path=/; max-age=0;";
                setHasHandledCompleted(true);

                toast.success("✅ Completed meeting", {
                    position: "top-center",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2500);
            } catch (error) {
                console.error("Error handling completed meeting:", error);
            }
        };

        handleCompletedMeeting();
    }, [meeting, hasHandledCompleted]);

    useEffect(() => {
        if (meetingStatus && meeting) {
            const toastKey = `toast_shown_${meeting.id}_${meetingStatus}`;
            const hasShownToast = localStorage.getItem(toastKey);

            if (!hasShownToast && meetingStatus !== prevStatus) {
                toast.success(`🔔 Meeting status updated to: ${meetingStatus}`, {
                    position: "top-center",
                });
                localStorage.setItem(toastKey, "true");
                setPrevStatus(meetingStatus);
            }
        }
    }, [meetingStatus, meeting, prevStatus]);

    useEffect(() => {
        if (canJoin && !hasReloaded) {
            setHasReloaded(true);
            window.location.reload();
        }
    }, [canJoin, hasReloaded]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 px-4 text-center">
                <div className="spinner-border animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full"></div>
                <p className="mt-4">Loading meeting details...</p>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 px-4 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4">
                    No meeting currently lined up.
                </h2>
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
    const imageSrc = meeting.user_role === "admin" ? "/icons/inmated.svg" : "/icons/client.svg";

    const stepLabels = meeting.type === "line_up" ? ["Booked", "Line-Up"] :
        meeting.type === "upcoming" ? ["Upcoming"] :
            meeting.type === "completed" ? ["Completed"] : ["Unknown"];

    const stepStatuses = meeting.type === "line_up" ? ["booked", "line_up"] :
        meeting.type === "upcoming" ? ["upcoming"] :
            meeting.type === "completed" ? ["completed"] : ["unknown"];

    const currentStepIndex = stepStatuses.indexOf(meetingStatus);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4 sm:px-8 md:px-12 relative">
            <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-6 md:px-12 z-30">
                <div className="text-2xl font-bold tracking-tight text-white">{projectName}</div>
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
                    <img src={imageSrc} alt="client" className="w-14 h-14 rounded-full border border-zinc-700 shadow-sm dark:invert" />
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
                    <p><strong className="text-white">Status:</strong> {meetingStatus}</p>
                </div>

                {meeting.type === "upcoming" && (
                    <div className="pt-4">
                        {canJoin ? (
                            <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-block text-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                            >
                                🔗 Join Meeting
                            </a>
                        ) : (
                            <button
                                disabled
                                className="w-full px-5 py-2.5 bg-zinc-800 text-zinc-500 font-semibold rounded-4xl border border-zinc-700 cursor-not-allowed"
                            >
                                🔒 You can join 5 minutes before the meeting
                            </button>
                        )}
                    </div>
                )}

                <div className="pt-4">
                    <div className="flex justify-between items-center text-xs font-medium text-zinc-400">
                        {stepLabels.map((label, index) => {
                            const isActive = currentStepIndex >= index;
                            return (
                                <div key={index} className="flex-1 text-center">
                                    <div className={`h-2 rounded-full mx-1 transition-all duration-300 ${isActive ? "bg-green-400" : "bg-zinc-700"}`} />
                                    <span className="block mt-1">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Meeting;
