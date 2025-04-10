"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useMeetingContext } from "@/constants/MeetingContext";
import MeetingList from "@/components/MeetingList";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RescheduleModal from "@/components/RescheduleModal";

export default function EventPage() {
    const { meetings, upcomingMeetingIds, lineupMeetingIds } = useMeetingContext();

    const [openDialog, setOpenDialog] = useState(false);
    const [openReschedule, setOpenReschedule] = useState(false);
    const [userName, setUserName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [newMeeting, setNewMeeting] = useState(null);

    const contentRef = useRef(null);

    useEffect(() => {
        if (typeof meetings !== "undefined") {
            gsap.from(contentRef.current, {
                opacity: 1,
                y: 30,
                duration: 1,
                ease: "power3.out",
            });
        }
    }, [meetings]);

    const handleNext = () => {
        const meeting = {
            user_name: userName,
            business_type: businessType,
            selectDay: "",
            selectTime: "",
            slot: "",
            title: `Meeting with ${userName}`,
        };
        setNewMeeting(meeting);
        setOpenDialog(false);
        setOpenReschedule(true);
    };

    const upcomingMeetings = meetings?.filter((m) =>
        upcomingMeetingIds.includes(m.id)
    );
    const lineupMeetings = meetings?.filter((m) =>
        lineupMeetingIds.includes(m.id)
    );

    return (
        <div
            ref={contentRef}
            className="min-h-screen bg-gray-100 text-gray-800 px-4 py-6 md:px-12"
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    Event Dashboard
                </h1>

                {/* Upcoming Meetings Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-blue-600">
                            ⏳ Upcoming Meetings
                        </h2>
                        <Button onClick={() => setOpenDialog(true)}>+ Create New Event</Button>
                    </div>
                    {upcomingMeetings?.length === 0 ? (
                        <p className="text-gray-500 italic">No upcoming meetings found.</p>
                    ) : (
                        <MeetingList meetings={upcomingMeetings} type="upcoming" />
                    )}
                </section>

                {/* Lineup Meetings Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                        📌 Lineup Meetings
                    </h2>
                    {lineupMeetings?.length === 0 ? (
                        <p className="text-gray-500 italic">No lineup meetings found.</p>
                    ) : (
                        <MeetingList meetings={lineupMeetings} type="lineup" />
                    )}
                </section>
            </div>

            {/* Create Meeting Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white text-gray-900 p-6 rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle>Create New Meeting</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">User Name</Label>
                            <Input
                                placeholder="Enter your name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <Label className="mb-2">Business Type</Label>
                            <Select onValueChange={setBusinessType}>
                                <SelectTrigger className="focus:ring-2 focus:ring-blue-400">
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="conste">Conste</SelectItem>
                                    <SelectItem value="enquiry">Enquiry</SelectItem>
                                    <SelectItem value="build a website">Build a Website</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpenDialog(false)}
                                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleNext}>Next</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reschedule Modal */}
            {openReschedule && newMeeting && (
                <RescheduleModal meeting={newMeeting} onClose={() => setOpenReschedule(false)} />
            )}
        </div>
    );
}
