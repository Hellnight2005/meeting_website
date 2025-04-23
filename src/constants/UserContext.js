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

          // Fetch meetings and set cookie
          await fetchMeetingsAndSetCookie(result.User.id);
        } else {
          console.error("Failed to fetch user from API");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    } else {
      setUserState(data);
      if (data?.id) {
        await fetchMeetingsAndSetCookie(data.id);
      }
    }
  };

  const fetchMeetingsAndSetCookie = async (userId) => {
    try {
      const res = await fetch("/api/meeting/get_by_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        // console.log("usercontext api respone", res.token);

        const { token } = await res.json();

        // Validate that the token looks like a JWT (3 parts separated by dots)
        const isJwt =
          token && typeof token === "string" && token.split(".").length === 3;

        if (isJwt) {
          document.cookie = `meeting=${token}; path=/; max-age=86400`;
        } else {
          // Clear the cookie if invalid or empty
          document.cookie =
            "meeting=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        }
      } else {
        console.error("Failed to fetch meetings");
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
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

  const logout = () => {
    if (typeof document !== "undefined") {
      // Remove both token and meeting cookies
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie =
        "meeting=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/sign_up";
    }

    setUserState(null);
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
    <UserContext.Provider value={{ user, setUser, fetchUserByAdmin, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
