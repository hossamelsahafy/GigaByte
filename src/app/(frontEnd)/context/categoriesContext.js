"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(`/api/categories`);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        const sortedCategories = data.docs.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setCategories(sortedCategories);
      } catch (error) {}
    };

    getCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
