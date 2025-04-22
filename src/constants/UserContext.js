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
          setUserState({ ...result.User });
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

  const getUserFromToken = () => {
    if (typeof window === "undefined") return null;
    try {
      const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
      const token = match?.[1];
      if (!token) return null;
      const payload = token.split(".")[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const parsed = JSON.parse(decoded);
      return parsed?.userId || null;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  // ✅ Admin-only fetch user by ID
  const fetchUserByAdmin = async (targetUserId) => {
    if (user?.role !== "admin") {
      console.warn("Unauthorized: Only admin can fetch other users.");
      return null;
    }

    try {
      const res = await fetch(`/api/user/${targetUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const result = await res.json();
        return result.User;
      } else {
        console.error("Failed to fetch user by ID");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      const userId = getUserFromToken();
      if (userId) {
        setUser({ id: userId });
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserByAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
