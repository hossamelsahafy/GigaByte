"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        setLoading(true);

        if (status === "loading" || !session) {
          throw new Error("No valid session found");
        }

        const token = session.token;
        if (!token) throw new Error("No valid session or token found");

        const decodedUser = jwtDecode(token);
        if (!decodedUser?.id) throw new Error("Invalid session token");

        setUser(decodedUser);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/orders`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");

        const ordersData = await response.json();
        const userOrders = ordersData.docs.filter(
          (order) => order.user === decodedUser.id
        );

        setOrders(userOrders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchUserAndOrders();
    }
  }, [session, status]);

  return (
    <OrdersContext.Provider value={{ orders, loading, error, user }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
