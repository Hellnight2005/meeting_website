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
    const [hour, minutePart] = time.split(":");
    const isPM = time.includes("PM");
    let hr = parseInt(hour);
    let min = time.includes("30") ? 30 : 0;

    if (hr === 12) {
      if (!isPM) hr = 0;
    } else if (isPM) {
      hr += 12;
    }

    let date = new Date(2020, 0, 1, hr, min);
    date.setMinutes(date.getMinutes() + 60); // 1 hour block
    return format(date, "h:mm a");
  };

  // ✅ Full fetch: all meetings and blockedDays
  const fetchMeetings = async () => {
    try {
      const meetingResponse = await axios.get(
        "http://localhost:5000/meeting/get"
      );
      const allMeetings = meetingResponse.data;
      setMeetingsData(allMeetings);

      const approvedResponse = await axios.get(
        "http://localhost:5000/meeting/meetings"
      );
      const approvedMeetings = approvedResponse.data.approvedMeetings;

      const blockedDaysData = {};
      approvedMeetings.forEach((meeting) => {
        const day = meeting.day;
        blockedDaysData[day] = blockedDaysData[day] || [];

        meeting.times.forEach((timeSlot) => {
          const startTime = timeSlot.time;
          const endTime = getNextSlot(startTime);
          blockedDaysData[day].push(startTime);
          blockedDaysData[day].push(endTime);
        });
      });

      setBlockedDays(blockedDaysData);

      const upcoming = [];
      const lineup = [];
      allMeetings.forEach((meeting) => {
        if (meeting.type === "upcoming") upcoming.push(meeting._id);
        else if (meeting.type === "line up") lineup.push(meeting._id);
      });
      setUpcomingMeetingIds(upcoming);
      setLineupMeetingIds(lineup);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only refresh approved/blocked days
  const fetchApprovedMeetings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/meeting/meetings");
      const approvedMeetings = res.data.approvedMeetings;

      const blockedDaysData = {};
      approvedMeetings.forEach((meeting) => {
        const day = meeting.day;
        blockedDaysData[day] = blockedDaysData[day] || [];

        meeting.times.forEach((timeSlot) => {
          const startTime = timeSlot.time;
          const endTime = getNextSlot(startTime);
          blockedDaysData[day].push(startTime);
          blockedDaysData[day].push(endTime);
        });
      });

      setBlockedDays(blockedDaysData);
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
        refreshMeetings: fetchMeetings, // 👈 full refresh
        refreshBlockedDays: fetchApprovedMeetings, // 👈 only blocked times
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
