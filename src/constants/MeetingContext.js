"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const MeetingContext = createContext();
export const useMeetingContext = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [meetingsData, setMeetingsData] = useState([]);
  const [upcomingMeetingIds, setUpcomingMeetingIds] = useState([]);
  const [lineupMeetingIds, setLineupMeetingIds] = useState([]);
  const [blockedDays, setBlockedDays] = useState({});
  const [loading, setLoading] = useState(true);

  const getNextSlot = (time) => {
    const [hour] = time.split(":");
    const isPM = time.includes("PM");
    let hr = parseInt(hour);
    let min = time.includes("30") ? 30 : 0;

    if (hr === 12 && !isPM) hr = 0;
    else if (isPM) hr += 12;

    let date = new Date(2020, 0, 1, hr, min);
    date.setMinutes(date.getMinutes() + 60);
    return format(date, "h:mm a");
  };

  const computeBlockedDays = (approvedMeetings) => {
    const blocked = {};

    approvedMeetings.forEach((meeting) => {
      const day = meeting.day;
      blocked[day] = blocked[day] || [];

      meeting.times.forEach(({ time }) => {
        const startTime = time;
        const endTime = getNextSlot(time);
        blocked[day].push(startTime, endTime);
      });
    });

    return blocked;
  };

  const updateMeetingTypes = (allMeetings) => {
    const upcoming = [];
    const lineup = [];

    allMeetings.forEach((meeting) => {
      if (meeting.type === "upcoming") upcoming.push(meeting.id);
      else if (meeting.type === "line_up") lineup.push(meeting.id);
    });

    setUpcomingMeetingIds(upcoming);
    setLineupMeetingIds(lineup);
  };

  const fetchMeetings = async () => {
    try {
      const [meetingRes, approvedRes] = await Promise.all([
        axios.get("/api/meeting/meeting_get"),
        axios.get("/api/meeting/approve_meeting"),
      ]);

      const allMeetings = meetingRes.data;
      const approvedMeetings = approvedRes.data.approvedMeetings;

      setMeetingsData(allMeetings);
      setBlockedDays(computeBlockedDays(approvedMeetings));
      updateMeetingTypes(allMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedMeetings = async () => {
    try {
      const res = await axios.get("/api/meeting/approve_meeting");
      const approvedMeetings = res.data.approvedMeetings;

      const updatedBlockedDays = computeBlockedDays(approvedMeetings);
      setBlockedDays(updatedBlockedDays);
    } catch (err) {
      console.error("Error refreshing blocked days:", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <MeetingContext.Provider
      value={{
        meetingsData,
        upcomingMeetingIds,
        lineupMeetingIds,
        blockedDays,
        loading,
        refreshMeetings: fetchMeetings,
        refreshBlockedDays: fetchApprovedMeetings,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
