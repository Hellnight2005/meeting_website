"use client";
import { createContext, useState, useContext, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  const setUser = async (data) => {
    if (data?.id && !data.displayName) {
      try {
        const res = await fetch(`/api/user/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const result = await res.json();
          setUserState({ ...result.User }); // Add 'type' manually if not returned
        } else {
          console.error("Failed to fetch user from API");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    } else {
      setUserState(data);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
