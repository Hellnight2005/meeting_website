"use client";
import { createContext, useContext, useState } from "react";

const MeetingContext = createContext();

export const useMeetingContext = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);

  return (
    <MeetingContext.Provider value={{ meetings, setMeetings }}>
      {children}
    </MeetingContext.Provider>
  );
};
