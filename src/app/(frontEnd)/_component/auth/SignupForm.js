const SignupForm = ({ hasAgreed, openPolicyModal, setHasAgreed }) => {
  return (
    <div>
      <form className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="First Name"
            className="w-1/2 bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md flex-1"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-1/2 bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md flex-1"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
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
