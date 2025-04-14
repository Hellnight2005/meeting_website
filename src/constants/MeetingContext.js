"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const MeetingContext = createContext();
export const useMeetingContext = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [meetingsData, setMeetingsData] = useState([]); // Only keeping full data
  const [upcomingMeetingIds, setUpcomingMeetingIds] = useState([]);
  const [lineupMeetingIds, setLineupMeetingIds] = useState([]);
  const [blockedDays, setBlockedDays] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const meetingResponse = await axios.get(
        "http://localhost:5000/meeting/get"
      );
      const meetingsData = meetingResponse.data;
      setMeetingsData(meetingsData); // Save all meeting data

      const approvedMeetingsResponse = await axios.get(
        "http://localhost:5000/meeting/meetings"
      );
      const approvedMeetings = approvedMeetingsResponse.data.approvedMeetings;

      const blockedDaysData = {};
      Object.keys(approvedMeetings).forEach((day) => {
        const timeSlots = approvedMeetings[day];
        blockedDaysData[day] = blockedDaysData[day] || {};
        Object.keys(timeSlots).forEach((time) => {
          blockedDaysData[day][time] = timeSlots[time];
        });
      });
      setBlockedDays(blockedDaysData);

      const upcoming = [];
      const lineup = [];
      meetingsData.forEach((meeting) => {
        if (meeting.type === "upcoming") upcoming.push(meeting._id);
        else if (meeting.type === "line up") lineup.push(meeting._id);
      });
      setUpcomingMeetingIds(upcoming);
      setLineupMeetingIds(lineup);

      console.log("Upcommingmeeting", upcoming);
      console.log("Line up", lineup);
      console.log("Meeting Data", meetingsData);
      console.log("Blocked Days", blockedDaysData);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
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
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
