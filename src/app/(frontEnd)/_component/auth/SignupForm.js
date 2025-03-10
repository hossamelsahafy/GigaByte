import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupForm = ({
  hasAgreed,
  openPolicyModal,
  setHasAgreed,
  setIsLogin,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const Router = useRouter();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasAgreed) return;

    setMessage({ type: "", text: "" });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMessage({
        type: "success",
        text: data.message || "Signup successful!",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);

      setIsLogin(true);
    } else {
      setMessage({ type: "error", text: data.message || "Signup failed!" });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-1/2 bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md flex-1"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-1/2 bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md flex-1"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
          required
        />

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="accent-[var(--accent-color)]"
          />
          <label htmlFor="agree" className="text-sm">
            I agree to the{" "}
            <button
              type="button"
              onClick={openPolicyModal}
              className="text-[var(--hover-color)] hover:underline"
            >
              Terms and Privacy Policy
            </button>
          </label>
        </div>

        {message.text && (
          <p
            className={`text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={!hasAgreed}
          className="bg-[var(--accent-color)] text-[var(--background-color)] p-2 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-color)] transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
