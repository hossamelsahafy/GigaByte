"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [name, setName] = useState("SignUp");

  // Check localStorage for token on initial render
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setName("Account");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ name, setName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
