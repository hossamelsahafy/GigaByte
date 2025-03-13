"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { decode } from "jsonwebtoken";
import { useCart } from "../../context/CartContext";

export default function CheckoutForm({ onClose }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const { cartItems, setCartItems } = useCart();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    totalPrice: 0,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const sessionToken = session?.token || null;
    const finalToken = storedToken || sessionToken;

    setToken(finalToken);

    const getEmail = async () => {
      if (finalToken) {
        try {
          const decoded = decode(finalToken);
          setEmail(decoded.email || "");
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    };

    getEmail();
  }, [session]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email }));
  }, [email, cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      email,
      cartItems: cartItems || [],
      totalPrice: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        setMessage({
          text: "Order placed successfully! We will contact you shortly.",
          type: "success",
        });
        setTimeout(() => {
          onClose();
          localStorage.removeItem("cart");
          router.push("/");
          setCartItems([]);
        }, 5000);
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "Failed to place order. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center p-4">
      <div className="bg-[var(--card-bg)] rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[var(--accent-color)] mb-4">
          Checkout
        </h2>
        {message.text && (
          <div
            className={`text-center p-2 rounded-md ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-[var(--secondary-bg)]"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-[var(--secondary-bg)]"
            required
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-[var(--secondary-bg)]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[var(--button-bg)] hover:bg-[var(--hover-color)] text-white py-2 rounded-lg"
          >
            Place Order
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
