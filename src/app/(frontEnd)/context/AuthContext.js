"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [token, setToken] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const sessionToken = session?.token;

    const authToken = sessionToken;

    if (authToken) {
      setToken(authToken);
      setName("Account");
    } else {
      setToken(null);
      setName("SignUp");
    }
  }, [session, status, router]);

  return (
    <AuthContext.Provider value={{ name, setName, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
