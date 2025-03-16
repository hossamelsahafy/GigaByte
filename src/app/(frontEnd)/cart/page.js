"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { IoMdAdd, IoMdRemove, IoMdTrash } from "react-icons/io";
import Checkout from "../_component/cart/ProceedToCheckOut"; // Import the Checkout component

export default function CartPage() {
  const { cartItems, setCartItems } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const updateQuantity = (productId, amount) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--foreground-color)] flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-[var(--accent-color)] mb-8">
        Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-lg text-[var(--foreground-color)]">
          Your cart is empty.
        </p>
      ) : (
        <div className="w-full max-w-4xl bg-[var(--card-bg)] shadow-2xl rounded-2xl p-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-[var(--secondary-bg)] py-4 hover:bg-[var(--secondary-bg)] transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.images[0].image.cloudinaryUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-20 h-20 hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <h2 className="text-xl font-semibold text-[var(--hover-color)]">
                    {item.name}
                  </h2>
                  <p className="text-lg text-[var(--accent-color)]">
                    EGP{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-[var(--button-bg)] hover:bg-[var(--hover-color)] text-white p-2 rounded-lg transition-all duration-300"
                >
                  <IoMdRemove />
                </button>
                <span className="text-lg font-bold text-[var(--foreground-color)]">
                  {item.quantity || 1}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-[var(--button-bg)] hover:bg-[var(--hover-color)] text-white p-2 rounded-lg transition-all duration-300"
                >
                  <IoMdAdd />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg transition-all duration-300"
                >
                  <IoMdTrash />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 text-xl font-bold">
            <span className="text-[var(--hover-color)]">Total:</span>
            <span className="text-[var(--accent-color)]">
              EGP{totalPrice.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-[var(--button-bg)] hover:bg-[var(--hover-color)] text-white py-3 rounded-lg mt-6 transition-all duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
      {isCheckoutOpen && <Checkout onClose={() => setIsCheckoutOpen(false)} />}
    </div>
  );
}
