"use client";
import { createContext, useContext, useEffect, useState } from "react";
import fakeAppointment from "./fakeAppointments";
import { parse, isSameDay } from "date-fns";

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

      console.log("Upcoming Meeting IDs:", upcoming);
      console.log("Lineup Meeting IDs:", lineup);
    } catch (error) {
      console.error("Error processing meetings:", error);
    }
  }, []);

  // ✅ Updated: Get full meeting objects by selected date
  const getMeetingsByDay = (day) => {
    const selectedDate = new Date(day);

    return meetings.filter((meeting) => {
      try {
        if (typeof meeting.selectDay !== "string") return false;

        const meetingDate = parse(
          meeting.selectDay,
          "EEEE, MMMM d, yyyy",
          new Date()
        );
        return isSameDay(meetingDate, selectedDate);
      } catch (err) {
        console.warn("Invalid meeting date format:", meeting.selectDay, err);
        return false;
      }
    });
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        setMeetings,
        upcomingMeetingIds,
        lineupMeetingIds,
        getMeetingsByDay,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
