import React, { useState } from "react";

export default function AdminGate({ children }) {
  const [code, setCode] = useState("");
  const [ok, setOk] = useState(localStorage.getItem("adminPanelCodeOk") === "yes");
  const [error, setError] = useState("");

  function handleCheck(e) {
    e.preventDefault();
    if (code.trim() === "0401") {
      localStorage.setItem("adminPanelCodeOk", "yes");
      setOk(true);
    } else {
      setError("❌ Incorrect code. Try again.");
      setTimeout(() => setError(""), 2000);
    }
  }

  if (ok) return children;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--main-bg)] text-[var(--main-gold)] px-4">
      <form
        onSubmit={handleCheck}
        className="u-card flex flex-col items-center gap-5 w-full max-w-md animate-fade-in"
      >
        <h2 className="text-3xl font-extrabold tracking-wide text-[var(--main-gold)] drop-shadow">
          Admin Panel Access
        </h2>

        {error && (
          <div className="w-full px-4 py-2 text-center text-sm font-semibold rounded-lg bg-[#ff658422] text-[#ff6584] border border-[#ff6584] animate-fade-in">
            {error}
          </div>
        )}

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          type="password"
          className="w-full px-4 py-3 rounded-xl bg-[var(--main-dark)] text-[var(--main-gold)] border border-[var(--main-gold-dark)] focus:ring-2 focus:ring-[var(--main-gold)] text-center text-lg font-mono outline-none transition-all"
          placeholder="Enter Admin Code"
          autoFocus
        />

        <button
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[var(--main-gold-dark)] via-[var(--main-gold)] to-[var(--main-gold-dark)] text-[var(--main-dark)] font-extrabold tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 text-lg"
          type="submit"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
