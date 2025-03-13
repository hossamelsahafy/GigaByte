"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { IoLogOut, IoTrash, IoRefresh } from "react-icons/io5";
import { useOrders } from "../context/OrderContext";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { orders, loading, error } = useOrders();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [id, setId] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    try {
      const token =
        session?.token ||
        (typeof window !== "undefined" && localStorage.getItem("token"));

      if (!token) throw new Error("No valid session or token found");

      const decodedUser = jwtDecode(token);

      if (!decodedUser) throw new Error("Invalid session token");

      setUser(decodedUser);
      setId(decodedUser.id);
      setName(decodedUser.name || decodedUser.firstName);
      setPhone(decodedUser.phoneNumber || "");
      setProvider(decodedUser.provider);
    } catch (err) {
      setLocalError(err.message);
    }
  }, [session, status]);

  const handleDelete = async () => {
    if (orders.length > 0) {
      setLocalError("Cannot delete account with active orders!");
      return;
    }

    try {
      const token = session?.token;

      if (!token) {
        setLocalError("Authentication error. Please sign in again.");
        return;
      }

      const res = await fetch(`/api/auth/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await signOut({ redirect: false });
        router.push("/");
      } else {
        const errorData = await res.json();
        setLocalError(errorData.error || "Failed to delete account.");
      }
    } catch (err) {
      setLocalError("An error occurred while deleting your account.");
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ name, phone, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setLocalError("Failed to update profile.");
      }
    } catch (err) {
      setLocalError("An error occurred while updating your profile.");
    }
  };

  const handleSignout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8">Account</h1>

      {successMessage && (
        <p className="bg-green-600 text-white p-3 rounded-lg w-full max-w-md text-center">
          {successMessage}
        </p>
      )}
      {(localError || error) && (
        <p className="bg-red-600 text-white p-3 rounded-lg w-full max-w-md text-center">
          {localError || error}
        </p>
      )}

      <div className="w-full max-w-2xl shadow-lg rounded-lg p-6 bg-[#161B22]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#0D1117] text-white"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#0D1117] text-white"
              />
            </div>
            {provider === "credential" ||
              ("local" && (
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-[#0D1117] text-white"
                  />
                </div>
              ))}
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <IoRefresh className="text-xl" />
              Update Profile
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          {loading ? (
            <p className="text-center text-lg">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-lg">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg bg-[#0D1117]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-400">
                        Status: {order.status}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      EGP{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <ul className="space-y-2">
                      {order.products.map((product) => (
                        <li key={product.product.id} className="text-sm">
                          {product.product.name} - {product.quantity}x
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <IoTrash className="text-xl" />
            Delete Account
          </button>
          <button
            onClick={handleSignout}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <IoLogOut className="text-xl" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
