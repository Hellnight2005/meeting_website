// context/AdminContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMeetingContext } from "./MeetingContext";

const AdminContext = createContext();
export const useAdminContext = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [meetingsData, setMeetingsData] = useState([]);
  const [upcomingMeetingIds, setUpcomingMeetingIds] = useState([]);
  const [lineupMeetingIds, setLineupMeetingIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const { fetchApprovedMeetings } = useMeetingContext();

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
      const meetingRes = await axios.get("/api/Meeting/meeting_get");
      const allMeetings = meetingRes.data;

      setMeetingsData(allMeetings);
      updateMeetingTypes(allMeetings);

      // Fetch approved meetings to update blockedDays
      await fetchApprovedMeetings();
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
    <AdminContext.Provider
      value={{
        meetingsData,
        upcomingMeetingIds,
        lineupMeetingIds,
        loading,
        refreshMeetings: fetchMeetings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
