"use client";
import { createContext, useContext, useEffect, useState } from "react";
import fakeAppointment from "./fakeAppointments";

const MeetingContext = createContext();

export const useMeetingContext = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
  const [upcomingMeetingIds, setUpcomingMeetingIds] = useState([]);
  const [lineupMeetingIds, setLineupMeetingIds] = useState([]);

  useEffect(() => {
    try {
      const data = fakeAppointment;

      setMeetings(data);

      const upcoming = data
        .filter((item) => item.type === "upcoming")
        .map((item) => item.id);

      const lineup = data
        .filter((item) => item.type === "lineup")
        .map((item) => item.id);

      setUpcomingMeetingIds(upcoming);
      setLineupMeetingIds(lineup);

      // ✅ Console log the arrays
      console.log("Upcoming Meeting IDs:", upcoming);
      console.log("Lineup Meeting IDs:", lineup);
    } catch (error) {
      console.error("Error processing meetings:", error);
    }
  }, []);

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        setMeetings,
        upcomingMeetingIds,
        lineupMeetingIds,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
