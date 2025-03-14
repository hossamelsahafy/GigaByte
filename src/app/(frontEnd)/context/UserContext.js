"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "loading") return; // Wait for session to load

      if (!session || !session.token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(session.token.split(".")[1]));
        const userId = decoded.id;

        const res = await fetch(`/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setCurrentUser(data.user);
        } else {
          console.error("Failed to fetch user:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, status]);

  return (
    <UserContext.Provider value={{ currentUser, loading, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
