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
      if (status === "loading") return;

      if (!session || !session.token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(session.token.split(".")[1]));
        setCurrentUser(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
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
